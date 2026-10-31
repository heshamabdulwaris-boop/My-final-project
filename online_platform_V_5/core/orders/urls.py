from django.urls import path
from .views import (CreateOrderView, OrderHistoryView, CreatePaypalOrderView, CapturePaypalOrderView,
                    PlatformRevenueView, SellerRevenueView,)

urlpatterns = [
    path("create/", CreateOrderView.as_view()),
    # path('payment/start/<int:order_id>/', StartPaymentView.as_view()),
    # path('payment/confirm/<int:payment_id>/', ConfirmPaymentView.as_view()),
    path("orderhistory/", OrderHistoryView.as_view()),
    path("paypal/create/<int:order_id>/",CreatePaypalOrderView.as_view()),
    path("paypal/capture/<int:order_id>/",CapturePaypalOrderView.as_view()),
    path("platform-revenue/", PlatformRevenueView.as_view()),
    path("seller-revenue/", SellerRevenueView.as_view()),
]