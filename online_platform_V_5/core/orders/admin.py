from django.contrib import admin
from .models import Order, OrderItem, Payment


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "status",
        "total_price",
        "created_at",
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "product",
        "price",
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "amount",
        "currency",
        "status",
        "paypal_order_id",
        "transaction_id",
        "created_at",
    )

    list_filter = (
        "status",
        "currency",
    )

    search_fields = (
        "paypal_order_id",
        "transaction_id",
    )