import re
from rest_framework import serializers
from .models import User, ContactMessage

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class RegisterSerializer(serializers.ModelSerializer):

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)

        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )

        if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]", value):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )

        return value

    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'full_name', 'role', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            full_name=validated_data.get('full_name', ''),
            role=validated_data.get('role', 'buyer'),
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'role', 'is_super_admin']
        extra_kwargs = {'password': {'write_only': True}}

class UpdateProfileSerializer(serializers.ModelSerializer): # maybe we don't need this anymore
    class Meta:
        model = User
        fields = ['username', 'full_name', ]


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField()


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "is_super_admin",
        ]
        read_only_fields = [
            "id",
            "role",
            "is_super_admin",
        ]

class ChangeRoleSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["role"]


class ContactMessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "full_name",
            "email",
            "message",
            "reply",
            "is_read",
            "created_at",
            "replied_at",
        ]
        read_only_fields = [
            "is_read",
            "created_at",
            "replied_at",
        ]

    def validate_full_name(self, value):

        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError(
                "Full name must contain at least 3 characters."
            )

        return value

    def validate_message(self, value):

        value = value.strip()

        if len(value) < 10:
            raise serializers.ValidationError(
                "Message must contain at least 10 characters."
            )

        return value


class ContactMessageReplySerializer(serializers.Serializer):
    reply = serializers.CharField()
