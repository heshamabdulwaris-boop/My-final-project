from rest_framework import serializers
from .models import Product, DownloadHistory
import os
from django.conf import settings


class ProductSerializer(serializers.ModelSerializer):

    # validation for files
    def validate_file(self, value):

        if value.size > settings.MAX_UPLOAD_SIZE:
            raise serializers.ValidationError(
                "File size exceeds the maximum allowed limit."
            )

        ext = os.path.splitext(
            value.name
        )[1].lower()

        if ext not in settings.ALLOWED_UPLOAD_EXTENSIONS:
            raise serializers.ValidationError(
                "This file type is not allowed."
            )

        return value

    # validation for prince(do not accept negative price)
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than zero."
            )

        return value

    # validation for image cover
    def validate_cover_image(self, value):
        ext = os.path.splitext(value.name)[1].lower()

        allowed = [".jpg", ".jpeg", ".png", ".webp"]

        if ext not in allowed:
            raise serializers.ValidationError(
                "Only JPG, PNG and WEBP images are allowed."
            )

        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError(
                "Maximum image size is 5 MB."
            )

        return value

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "description",
            "category",
            "price",
            "cover_image",
            "file",
            "created_at",
            "status",
        ]

        read_only_fields = [
            "status",
        ]


class SellerProductSerializer(serializers.ModelSerializer):

    #validation for files
    def validate_file(self, value):

        if value.size > settings.MAX_UPLOAD_SIZE:
            raise serializers.ValidationError(
                "File size exceeds the maximum allowed limit."
            )

        ext = os.path.splitext(
            value.name
        )[1].lower()

        if ext not in settings.ALLOWED_UPLOAD_EXTENSIONS:
            raise serializers.ValidationError(
                "This file type is not allowed."
            )

        return value

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "description",
            "category",
            "price",
            "cover_image",
            "file",
            "status",
            "rejection_reason",
            "created_at",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.status != "rejected":
            data.pop("rejection_reason", None)

        return data



class PurchasedProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "price",
            "file"
        ]

class DownloadHistorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.title"
    )

    class Meta:
        model = DownloadHistory
        fields = [
            "id",
            "product_name",
            "downloaded_at"
        ]

class RejectProductSerializer(serializers.Serializer):
    reason = serializers.CharField()


