from django.db import models
import random

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.core.exceptions import ValidationError



class User(AbstractUser):
    ROLE_CHOICES = (
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
        ('admin', 'Admin'),
    )

    is_super_admin = models.BooleanField(default=False)

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='buyer')

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(max_length=150, unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def clean(self):

        if self.is_super_admin:

            exists = User.objects.filter(
                is_super_admin=True
            ).exclude(
                pk=self.pk
            ).exists()

            if exists:
                raise ValidationError(
                    "Only one Super Admin is allowed."
                )

    def save(self, *args, **kwargs):

        self.full_clean()

        super().save(*args, **kwargs)


class PasswordResetOTP(models.Model): #code for reset password
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.code}"

class ContactMessage(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    reply = models.TextField(
        blank=True,
        null=True,
    )
    replied_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.full_name
