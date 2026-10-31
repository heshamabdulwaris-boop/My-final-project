from django.db.models import Count, Sum, Value
from django.db.models.functions import Coalesce

from rest_framework.views import APIView
from rest_framework.response import Response

from users.models import User
from products.models import Product, DownloadHistory
from orders.models import Order

from .permissions import IsAdminUserRole

from django.db.models import DecimalField
from decimal import Decimal

from django.utils import timezone
from datetime import timedelta

from .report_serializers import TopSellerReportSerializer, TopProductReportSerializer, RevenueReportSerializer, DownloadReportSerializer


class TopSellersReport(APIView):

    permission_classes = [IsAdminUserRole]

    def get(self, request):

        sellers = (
            User.objects
            .filter(role="seller")
            .annotate(
                products_count=Count("products", distinct=True),
                sales_count=Count("products__order_items", distinct=True),
                revenue=Coalesce(
                    Sum("products__order_items__price"),
                    Value(
                        Decimal("0.00"),
                        output_field=DecimalField(max_digits=10, decimal_places=2)
                    )
                )
            )
            .order_by("-revenue", "-sales_count")
        )

        data = []

        for seller in sellers:
            data.append({
                "id": seller.id,
                "seller": seller.username,
                "products": seller.products_count,
                "sales": seller.sales_count,
                "revenue": seller.revenue,
            })

        serializer = TopSellerReportSerializer(
            data,
            many=True
        )

        return Response(serializer.data)


class TopProductsReport(APIView):

    permission_classes = [IsAdminUserRole]

    def get(self, request):

        products = (
            Product.objects
            .filter(status="approved")
            .annotate(
                sales=Count("order_items", distinct=True),
                revenue=Coalesce(
                    Sum("order_items__price"),
                    Value(
                        Decimal("0.00"),
                        output_field=DecimalField(
                            max_digits=10,
                            decimal_places=2
                        )
                    )
                )
            )
            .order_by("-revenue", "-sales")
        )

        data = []

        for product in products:

            data.append({
                "id": product.id,
                "product": product.title,
                "seller": product.seller.username,
                "sales": product.sales,
                "revenue": product.revenue,
            })

        serializer = TopProductReportSerializer(
            data,
            many=True
        )

        return Response(serializer.data)


class RevenueReport(APIView):

    permission_classes = [IsAdminUserRole]

    def get(self, request):

        today = timezone.now().date()

        week_ago = today - timedelta(days=7)

        month_ago = today - timedelta(days=30)

        data = {

            "today": Order.objects.filter(
                status="paid",
                created_at__date=today
            ).aggregate(
                total=Coalesce(
                    Sum("total_price"),
                    Decimal("0.00")
                )
            )["total"],

            "this_week": Order.objects.filter(
                status="paid",
                created_at__date__gte=week_ago
            ).aggregate(
                total=Coalesce(
                    Sum("total_price"),
                    Decimal("0.00")
                )
            )["total"],

            "this_month": Order.objects.filter(
                status="paid",
                created_at__date__gte=month_ago
            ).aggregate(
                total=Coalesce(
                    Sum("total_price"),
                    Decimal("0.00")
                )
            )["total"],

            "all_time": Order.objects.filter(
                status="paid"
            ).aggregate(
                total=Coalesce(
                    Sum("total_price"),
                    Decimal("0.00")
                )
            )["total"],
        }

        serializer = RevenueReportSerializer(data)

        return Response(serializer.data)


class DownloadReport(APIView):

    permission_classes = [IsAdminUserRole]

    def get(self, request):

        downloads = (
            DownloadHistory.objects
            .values(
                "product__title",
                "product__seller__username"
            )
            .annotate(
                downloads=Count("id")
            )
            .order_by("-downloads")
        )

        data = []

        for item in downloads:

            data.append({
                "product": item["product__title"],
                "seller": item["product__seller__username"],
                "downloads": item["downloads"],
            })

        serializer = DownloadReportSerializer(
            data,
            many=True
        )

        return Response(serializer.data)