from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.title')

    class Meta:
        model = OrderItem
        fields = ['product_name', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'status',
            'total_price',
            'created_at',
            'items'
        ]

class SellerSaleSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.title"
    )

    buyer = serializers.CharField(
        source="order.user.username"
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "buyer",
            "price"
        ]