from django.db.models import Sum

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from users.models import User
from products.models import Product
from orders.models import Order
from .models import AdminLog

from .permissions import IsAdminUserRole
from .serializers import (
    AdminUserSerializer,
    AdminProductSerializer,
    AdminOrderSerializer,
    AdminOrderDetailSerializer,
    AdminLogSerializer,
)

from .services import log_admin_action

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class AdminDashboardView(APIView):

    permission_classes = [IsAdminUserRole]

    def get(self, request):

        total_users = User.objects.count()
        total_sellers = User.objects.filter(role="seller").count()
        total_buyers = User.objects.filter(role="buyer").count()

        total_products = Product.objects.count()
        approved_products = Product.objects.filter(
            status="approved"
        ).count()

        pending_products = Product.objects.filter(
            status="pending"
        ).count()

        rejected_products = Product.objects.filter(
            status="rejected"
        ).count()

        total_orders = Order.objects.count()

        paid_orders = Order.objects.filter(
            status="paid"
        ).count()

        total_revenue = Order.objects.filter(
            status="paid"
        ).aggregate(
            total=Sum("total_price")
        )["total"] or 0

        return Response({

            "users": {
                "total": total_users,
                "buyers": total_buyers,
                "sellers": total_sellers,
            },

            "products": {
                "total": total_products,
                "approved": approved_products,
                "pending": pending_products,
                "rejected": rejected_products,
            },

            "orders": {
                "total": total_orders,
                "paid": paid_orders,
            },

            "revenue": {
                "total": total_revenue
            }

        })



class AdminUsersView(APIView):

    permission_classes = [IsAdminUserRole]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'search',
                openapi.IN_QUERY,
                description="Search users by username",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                'page',
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER
            ),
        ]
    )
    def get(self, request):

        users = User.objects.all().order_by("-id")

        search = request.GET.get("search")

        if search:
            users = users.filter(
                username__icontains=search
            )

        paginator = PageNumberPagination()
        paginator.page_size = 10

        result_page = paginator.paginate_queryset(
            users,
            request
        )

        serializer = AdminUserSerializer(
            result_page,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )


class AdminProductsView(APIView):

    permission_classes = [IsAdminUserRole]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "search",
                openapi.IN_QUERY,
                description="Search by product title",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                "status",
                openapi.IN_QUERY,
                description="pending / approved / rejected",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                "page",
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER
            ),
        ]
    )
    def get(self, request):

        products = Product.objects.all().order_by("-id")

        search = request.GET.get("search")
        status = request.GET.get("status")

        if search:
            products = products.filter(
                title__icontains=search
            )

        if status:
            products = products.filter(
                status=status
            )

        paginator = PageNumberPagination()
        paginator.page_size = 10

        result_page = paginator.paginate_queryset(
            products,
            request
        )

        serializer = AdminProductSerializer(
            result_page,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )


class AdminOrdersView(APIView):

    permission_classes = [IsAdminUserRole]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "search",
                openapi.IN_QUERY,
                description="Search by customer username",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                "status",
                openapi.IN_QUERY,
                description="pending / paid / failed / canceled",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                "page",
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER
            ),
        ]
    )
    def get(self, request):

        orders = Order.objects.all().order_by("-id")

        search = request.GET.get("search")
        status = request.GET.get("status")

        if search:
            orders = orders.filter(
                user__username__icontains=search
            )

        if status:
            orders = orders.filter(
                status=status
            )

        paginator = PageNumberPagination()
        paginator.page_size = 10

        result_page = paginator.paginate_queryset(
            orders,
            request
        )

        serializer = AdminOrderSerializer(
            result_page,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )


class AdminOrderDetailView(APIView):

    permission_classes = [IsAdminUserRole]

    def get(self, request, order_id):

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=404
            )

        serializer = AdminOrderDetailSerializer(order)

        return Response(serializer.data)


class SuspendUserView(APIView):

    permission_classes = [IsAdminUserRole]

    def post(self, request, user_id):

        try:
            user = User.objects.get(id=user_id)

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=404
            )

        # Super Admin cannot suspend himself
        if user == request.user:
            return Response(
                {"error": "You cannot suspend yourself."},
                status=400
            )

        # Admin cannot suspend another Admin
        if (
            request.user.role == "admin"
            and not request.user.is_super_admin
        ):
            if user.role == "admin" or user.is_super_admin:
                return Response(
                    {
                        "error": "You cannot suspend another admin."
                    },
                    status=403
                )

        user.is_active = False
        user.save()

        log_admin_action(
            admin=request.user,
            action="Suspend User",
            target=user.username,
            description=f"{user.username} suspended."
        )

        return Response(
            {
                "message": "User suspended successfully."
            }
        )


class ActivateUserView(APIView):

    permission_classes = [IsAdminUserRole]

    def post(self, request, user_id):

        try:
            user = User.objects.get(id=user_id)

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=404
            )

        user.is_active = True
        user.save()

        log_admin_action(
            admin=request.user,
            action="Activate User",
            target=user.username,
            description=f"{user.username} activated."
        )

        return Response(
            {
                "message": "User activated successfully."
            }
        )


class AdminLogsView(APIView):

    permission_classes = [IsAdminUserRole]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "search",
                openapi.IN_QUERY,
                description="Search by admin username",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                "action",
                openapi.IN_QUERY,
                description="Filter by action",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                "admin",
                openapi.IN_QUERY,
                description="Filter by admin username",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                "page",
                openapi.IN_QUERY,
                description="Page number",
                type=openapi.TYPE_INTEGER
            ),
        ]
    )
    def get(self, request):

        if request.user.is_super_admin:
            logs = AdminLog.objects.all()
        else:
            logs = AdminLog.objects.filter(
                admin=request.user
            )

        search = request.GET.get("search")
        action = request.GET.get("action")
        admin_username = request.GET.get("admin")

        if search:
            logs = logs.filter(
                admin__username__icontains=search
            )

        if action:
            logs = logs.filter(
                action__icontains=action
            )

        if request.user.is_super_admin and admin_username:
            logs = logs.filter(
                admin__username__icontains=admin_username
            )

        logs = logs.order_by("-created_at")

        paginator = PageNumberPagination()
        paginator.page_size = 10

        result = paginator.paginate_queryset(
            logs,
            request
        )

        serializer = AdminLogSerializer(
            result,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )