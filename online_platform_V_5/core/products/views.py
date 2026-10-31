from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import FileResponse
from django.shortcuts import get_object_or_404

from drf_yasg.utils import swagger_auto_schema

from adminpanel.services import log_admin_action

from .models import Product, DownloadHistory
from orders.models import OrderItem
from .serializers import ProductSerializer, SellerProductSerializer, PurchasedProductSerializer, DownloadHistorySerializer, RejectProductSerializer
from orders.serializers import SellerSaleSerializer
from django.db import models
from django.db.models import Sum, Q, Count



@swagger_auto_schema(
    method='post',
    request_body=ProductSerializer
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_product(request):

    if request.user.role != 'seller':
        return Response({"error": "Only sellers can create products"}, status=403)

    serializer = ProductSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(
            seller=request.user,
            status="pending"
        )
        return Response(serializer.data)

    return Response(serializer.errors)

# 📦 لیست محصولات
@api_view(['GET'])
def list_products(request):

    products = Product.objects.filter(status="approved")

    search = request.GET.get("search")

    category = request.GET.get("category")

    min_price = request.GET.get("min_price")
    max_price = request.GET.get("max_price")

    if search:
        products = products.filter(
            title__icontains=search
        )

    if category:
        products = products.filter(category=category)

    if min_price:
        products = products.filter(
            price__gte=min_price
        )

    if max_price:
        products = products.filter(
            price__lte=max_price
        )

    serializer = ProductSerializer(
        products,
        many=True
    )
    return Response(serializer.data)


@api_view(['GET'])
def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    serializer = ProductSerializer(product)
    return Response(serializer.data)


class DownloadProductView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):

        product = get_object_or_404(Product, id=product_id)

        has_access = OrderItem.objects.filter(
            order__user=request.user,
            order__status="paid",
            product=product
        ).exists()

        if not has_access:
            return Response(
                {"error": "You have not purchased this product"},
                status=403
            )

        DownloadHistory.objects.create(
            user=request.user,
            product=product,
        )

        return FileResponse(product.file.open(), as_attachment=True)


class MyDownloadsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        downloads = DownloadHistory.objects.filter(
            user=request.user
        ).order_by("-downloaded_at")

        serializer = DownloadHistorySerializer(
            downloads,
            many=True
        )

        return Response(serializer.data)


class PurchasedProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        products = Product.objects.filter(
            order_items__order__user=request.user,
            order_items__order__status="paid"
        ).distinct()

        serializer = PurchasedProductSerializer(
            products,
            many=True
        )

        return Response(serializer.data)


class SellerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "seller":
            return Response(
                {"error": "Only sellers can access dashboard"},
                status=403
            )

        total_products = Product.objects.filter(
            seller=request.user
        ).count()

        sold_items = OrderItem.objects.filter(
            product__seller=request.user,
            order__status="paid"
        )

        total_sales = sold_items.count()

        revenue = (
            sold_items.aggregate(
                total=Sum("price")
            )["total"]
            or 0
        )

        return Response({
            "total_products": total_products,
            "total_sales": total_sales,
            "revenue": revenue
        })

class MyProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "seller":
            return Response(
                {"error": "Only sellers can access"},
                status=403
            )

        products = Product.objects.filter(
            seller=request.user
        ).order_by("-id")

        serializer = SellerProductSerializer(
            products,
            many=True
        )

        return Response(serializer.data)


class UpdateProductView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=ProductSerializer)
    def put(self, request, product_id):

        try:
            product = Product.objects.get(
                id=product_id,
                seller=request.user
            )
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=404
            )

        serializer = ProductSerializer(
            product,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )


class DeleteProductView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):

        try:
            product = Product.objects.get(
                id=product_id,
                seller=request.user
            )
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=404
            )

        product.delete()

        return Response({
            "message": "Product deleted successfully"
        })


class SellerSalesHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "seller":
            return Response(
                {"error": "Only sellers can access"},
                status=403
            )

        sales = OrderItem.objects.filter(
            product__seller=request.user,
            order__status="paid"
        ).order_by("-id")

        serializer = SellerSaleSerializer(
            sales,
            many=True
        )

        return Response(serializer.data)


class TopSellingProductsView(APIView):
    def get(self, request):

        products = Product.objects.annotate(
            sales_count=Count(
                "order_items",
                filter=models.Q(
                    order_items__order__status="paid"
                )
            )
        ).filter(sales_count__gt=0).order_by("-sales_count")[:10]

        data = []

        for product in products:
            data.append({
                "id": product.id,
                "title": product.title,
                "sales_count": product.sales_count
            })

        return Response(data)


class ApproveProductView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):

        if request.user.role != "admin":
            return Response(
                {"error": "Admin only"},
                status=403
            )

        try:
            product = Product.objects.get(
                id=product_id
            )
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=404
            )

        product.status = "approved"
        product.save()

        log_admin_action(
            admin=request.user,
            action="Approve Product",
            target=product.title,
            description="Product approved."
        )

        return Response({
            "message": "Product approved"
        })



class PendingProductsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # فقط ادمین اجازه دارد
        if request.user.role != "admin":
            return Response(
                {"error": "Admin only"},
                status=403
            )

        products = Product.objects.filter(
            status="pending"
        ).order_by("-created_at")

        serializer = ProductSerializer(
            products,
            many=True
        )

        return Response(serializer.data)


class RejectProductView(APIView):

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=RejectProductSerializer)
    def post(self, request, product_id):

        if request.user.role != "admin":
            return Response(
                {"error": "Admin only"},
                status=403
            )

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=404
            )

        serializer = RejectProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reason = serializer.validated_data["reason"]

        product.status = "rejected"
        product.rejection_reason = reason
        product.save()

        log_admin_action(
            admin=request.user,
            action="Reject Product",
            target=product.title,
            description=reason
        )

        return Response({
            "message": "Product rejected"
        })