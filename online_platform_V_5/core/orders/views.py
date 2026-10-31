from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import create_order_from_cart
from .serializers import OrderSerializer

from django.db.models import Sum

from .services import create_paypal_order, capture_paypal_order
from .models import Order, Payment, OrderItem

import uuid


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order = create_order_from_cart(request.user)

        if not order:
            return Response({"error": "Cart is empty"}, status=400)

        serializer = OrderSerializer(order)
        return Response(serializer.data)

# class StartPaymentView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def post(self, request, order_id):
#         try:
#             order = Order.objects.get(id=order_id, user=request.user)
#         except Order.DoesNotExist:
#             return Response({"error": "Order not found"}, status=404)
#
#         if order.status == "paid":
#             return Response({"error": "Already paid"}, status=400)
#
#         # ایجاد payment
#         payment = Payment.objects.create(
#             order=order,
#             amount=order.total_price
#         )
#
#         return Response({
#             "message": "Payment started",
#             "payment_id": payment.id,
#             "amount": payment.amount
#         })
#
# class ConfirmPaymentView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def post(self, request, payment_id):
#         try:
#             payment = Payment.objects.get(id=payment_id, order__user=request.user)
#         except Payment.DoesNotExist:
#             return Response({"error": "Payment not found"}, status=404)
#
#         # شبیه‌سازی موفق بودن پرداخت
#         payment.status = "success"
#         payment.transaction_id = str(uuid.uuid4())
#         payment.save()
#
#         # آپدیت order
#         order = payment.order
#         order.status = "paid"
#         order.save()
#
#         return Response({
#             "message": "Payment successful",
#             "transaction_id": payment.transaction_id
#         })


class OrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(
            user=request.user
        ).order_by('-created_at')

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)


class CreatePaypalOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):

        try:
            order = Order.objects.get(
                id=order_id,
                user=request.user
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "error": "Order not found."
                },
                status=404
            )

        paypal_order = create_paypal_order(order)

        payment, created = Payment.objects.get_or_create(
            order=order,
            defaults={
                "amount": order.total_price
            }
        )
        payment.paypal_order_id = paypal_order["id"]
        payment.currency = "USD"

        payment.save()

        return Response(paypal_order)


class CapturePaypalOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):

        try:
            payment = Payment.objects.get(
                order__id=order_id,
                order__user=request.user
            )

        except Payment.DoesNotExist:

            return Response(
                {
                    "error": "Payment not found."
                },
                status=404
            )

        paypal_response = capture_paypal_order(
            payment.paypal_order_id
        )

        if paypal_response["status"] == "COMPLETED":
            capture = paypal_response["purchase_units"][0]["payments"]["captures"][0]

            payment.status = Payment.Status.SUCCESS

            payment.transaction_id = capture["id"]

            payment.save()

            order = payment.order

            order.status = Order.Status.PAID

            order.save()
        return Response(paypal_response)


class PlatformRevenueView(APIView):     # For admin
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_super_admin:
            return Response(
                {"error": "Only Super Admin can access this page."},
                status=403
            )

        revenue = OrderItem.objects.aggregate(
            total=Sum("platform_fee")
        )["total"] or 0

        return Response({
            "platform_revenue": revenue
        })


class SellerRevenueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "seller":
            return Response(
                {"error": "Only sellers can access this endpoint."},
                status=403
            )

        revenue = OrderItem.objects.filter(
            seller=request.user
        ).aggregate(
            total=Sum("seller_amount")
        )["total"] or 0

        total_sales = OrderItem.objects.filter(
            seller=request.user
        ).count()

        return Response({
            "seller_revenue": revenue,
            "total_sales": total_sales
        })