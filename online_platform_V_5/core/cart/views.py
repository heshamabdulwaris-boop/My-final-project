from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CartItem
from products.models import Product

from drf_yasg.utils import swagger_auto_schema
from .serializers import AddToCartSerializer, RemoveFromCartSerializer


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=AddToCartSerializer)
    def post(self, request):
        print("ADD TO CART HIT")

        serializer = AddToCartSerializer(data=request.data)
        print("Step a :", serializer.is_valid())
        print("Step b :", serializer.data)
        print("Step c :", serializer.errors)

        if serializer.is_valid():
            product_id = serializer.validated_data["product_id"]

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response({"error": "Product not found"}, status=404)

            CartItem.objects.create(user=request.user, product=product)

            return Response({"message": "Added to cart"})

        return Response(serializer.errors, status=400)


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = CartItem.objects.filter(user=request.user)

        data = [
            {
                "product": item.product.title,
                "price": item.product.price,
                "quantity": item.quantity
            }
            for item in items
        ]

        return Response(data)

class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=RemoveFromCartSerializer)
    def post(self, request):

        serializer = RemoveFromCartSerializer(
            data=request.data
        )

        if serializer.is_valid():

            product_id = serializer.validated_data["product_id"]

            item = CartItem.objects.filter(
                user=request.user,
                product_id=product_id
            ).first()

            if not item:
                return Response(
                    {"error": "Item not found in cart"},
                    status=404
                )

            item.delete()

            return Response({
                "message": "Removed from cart"
            })

        return Response(
            serializer.errors,
            status=400
        )