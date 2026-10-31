from rest_framework import serializers


class TopSellerReportSerializer(serializers.Serializer):

    id = serializers.IntegerField()

    seller = serializers.CharField()

    products = serializers.IntegerField()

    sales = serializers.IntegerField()

    revenue = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )


class TopProductReportSerializer(serializers.Serializer):

    id = serializers.IntegerField()

    product = serializers.CharField()

    seller = serializers.CharField()

    sales = serializers.IntegerField()

    revenue = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )


class RevenueReportSerializer(serializers.Serializer):

    today = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    this_week = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    this_month = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    all_time = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )


class DownloadReportSerializer(serializers.Serializer):

    product = serializers.CharField()

    seller = serializers.CharField()

    downloads = serializers.IntegerField()