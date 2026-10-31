from rest_framework import serializers

from users.models import User
from products.models import Product
from orders.models import Order
from .models import AdminLog


class AdminUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "is_active",
            
        ]


class AdminProductSerializer(serializers.ModelSerializer):

    seller = serializers.CharField(
        source="seller.username"
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "price",
            "status",
            "seller",
            "created_at",
        ]


class AdminOrderSerializer(serializers.ModelSerializer):

    customer = serializers.CharField(
        source="user.username"
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "status",
            "total_price",
            "created_at",
        ]


from orders.models import OrderItem


class AdminOrderItemSerializer(serializers.ModelSerializer):

    product = serializers.CharField(
        source="product.title"
    )

    seller = serializers.CharField(
        source="product.seller.username"
    )

    class Meta:
        model = OrderItem
        fields = [
            "product",
            "seller",
            "price",
        ]


class AdminOrderDetailSerializer(serializers.ModelSerializer):

    customer = serializers.CharField(
        source="user.username"
    )

    payment_status = serializers.CharField(
        source="payment.status",
        read_only=True
    )

    transaction_id = serializers.CharField(
        source="payment.transaction_id",
        read_only=True
    )

    items = AdminOrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "status",
            "total_price",
            "created_at",
            "payment_status",
            "transaction_id",
            "items",
        ]


class AdminLogSerializer(serializers.ModelSerializer):

    admin = serializers.CharField(
        source="admin.username"
    )

    class Meta:
        model = AdminLog
        fields = [
            "id",
            "admin",
            "action",
            "target",
            "description",
            "created_at",
        ]