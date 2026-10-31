from django.db import models
from users.models import User


class Product(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    CATEGORY_CHOICES = [
        ("ebook", "Ebook"),
        ("course", "Course"),
        ("template", "Template"),
        ("photograph", "Photograph"),
        ("other", "Other"),
    ]

    title = models.CharField(max_length=200)

    description = models.TextField()

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default="other"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    rejection_reason = models.TextField(
        blank=True,
        default=""
    )

    price = models.IntegerField()

    cover_image = models.ImageField(
        upload_to="covers/",
        null=True,
        blank=True
    )

    file = models.FileField(upload_to="products/")

    seller = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="products"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title


class DownloadHistory(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    downloaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.user} - {self.product}"
    