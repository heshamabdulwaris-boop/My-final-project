from django.shortcuts import render, get_object_or_404

# Create your views here.
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .serializers import UpdateProfileSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status, generics
from .models import User, PasswordResetOTP, ContactMessage
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, ProfileSerializer, ChangeRoleSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, throttle_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
import requests
from rest_framework_simplejwt.tokens import RefreshToken

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
#reset password
import random
from django.core.mail import send_mail
from .models import User
from .serializers import (PasswordResetRequestSerializer, PasswordResetConfirmSerializer, ContactMessageSerializer, ContactMessageReplySerializer)

from .throttles import LoginThrottle, RegisterThrottle, PasswordResetThrottle


@swagger_auto_schema(method='post', request_body=RegisterSerializer)
@api_view(['POST'])
@throttle_classes([RegisterThrottle])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


User = get_user_model()
@swagger_auto_schema(method='post', request_body=LoginSerializer)
@api_view(['POST'])
@throttle_classes([LoginThrottle])
def login_user(request):

    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():

        user = authenticate(**serializer.validated_data)

        if user:

            refresh = RefreshToken.for_user(user)

            return Response({
                "user": UserSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            })

        return Response(
            {"error": "Invalid credentials"},
            status=400
        )

    return Response(serializer.errors, status=400)

@api_view(['GET'])
def test_role(request):
    user = request.user

    if user.is_authenticated:
        return Response({
            "username": user.username,
            "role": user.role
        })

    return Response({"error": "not authenticated"})


@swagger_auto_schema(
    method='put',
    request_body=UpdateProfileSerializer
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):

    serializer = UpdateProfileSerializer(
        request.user,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)

#reset password
@swagger_auto_schema(method='post', request_body=PasswordResetRequestSerializer)
@api_view(['POST'])
@throttle_classes([PasswordResetThrottle])
def password_reset_request(request):

    serializer = PasswordResetRequestSerializer(data=request.data)

    if serializer.is_valid():

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=404
            )

        code = str(random.randint(100000, 999999))

        PasswordResetOTP.objects.filter(user=user).delete()

        PasswordResetOTP.objects.create(
            user=user,
            code=code
        )

        send_mail(
            'Password Reset Code',
            f'Your verification code is: {code}',
            None,
            [email],
            fail_silently=False,
        )

        return Response({
            "message": "Verification code sent"
        })

    return Response(serializer.errors, status=400)


@swagger_auto_schema(method='post', request_body=PasswordResetConfirmSerializer)
@api_view(['POST'])
def password_reset_confirm(request):

    serializer = PasswordResetConfirmSerializer(
        data=request.data
    )

    if serializer.is_valid():

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        new_password = serializer.validated_data['new_password']

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=404
            )

        try:
            otp = PasswordResetOTP.objects.get(
                user=user,
                code=code
            )

        except PasswordResetOTP.DoesNotExist:
            return Response(
                {"error": "Invalid code"},
                status=400
            )

        user.set_password(new_password)
        user.save()

        otp.delete()

        return Response({
            "message": "Password changed successfully"
        })

    return Response(serializer.errors, status=400)


#google login
#google login
@api_view(['POST'])
def google_login(request):
    access_token = request.data.get('access_token')
    
    if not access_token:
        return Response(
            {"error": "Access token required"},
            status=400
        )
    
    google_response = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        params={"access_token": access_token}
    )
    
    if google_response.status_code != 200:
        return Response(
            {"error": "Invalid Google token"},
            status=400
        )
    
    google_data = google_response.json()
    email = google_data.get('email')
    name = google_data.get('name')
    
    # First try to get existing user
    try:
        user = User.objects.get(email=email)
        created = False
    except User.DoesNotExist:
        # Create new user with unusable password
        user = User(
            email=email,
            username=email,
            full_name=name,
        )
        user.set_unusable_password()
        user.save()
        created = True
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        "user": UserSerializer(user).data,
        "refresh": str(refresh),
        "access": str(refresh.access_token)
    })



class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = ProfileSerializer(
            request.user
        )

        return Response(serializer.data)

    @swagger_auto_schema(request_body=ProfileSerializer)
    def put(self, request):

        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )



class ChangeUserRoleView(APIView):

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["role"],
            properties={
                "role": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=["buyer", "seller", "admin"]
                ),
            },
        )
    )
    def patch(self, request, user_id):

        if not request.user.is_super_admin:
            return Response(
                {"error": "Only Super Admin can change roles."},
                status=403
            )

        try:
            user = User.objects.get(id=user_id)

        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=404
            )

        serializer = ChangeRoleSerializer(
            user,
            data=request.data,
            partial=True
        )

        if user == request.user:
            return Response(
                {"error": "You cannot change your own role."},
                status=400
            )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )


@swagger_auto_schema(
    method="post",
    operation_summary="Send Contact Message",
    operation_description="Allows users to send a contact message to the website administrator.",
    request_body=ContactMessageSerializer,
    responses={
        201: openapi.Response(
            description="Message sent successfully",
            examples={
                "application/json": {
                    "message": "Your message has been sent successfully."
                }
            }
        ),
        400: "Validation Error"
    }
)
@api_view(["POST"])
def contact_message(request):

    serializer = ContactMessageSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "message": "Your message has been sent successfully."
            },
            status=201
        )

    return Response(serializer.errors, status=400)


@swagger_auto_schema(operation_summary="List Contact Messages", operation_description="Only Super Admin can view all contact messages.",)
class ContactMessageListView(generics.ListAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):

        if not request.user.is_super_admin:
            raise PermissionDenied(
                "Only Super Admin can access this page."
            )

        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return ContactMessage.objects.all().order_by("-created_at")


class ContactMessageReplyView(APIView):

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["reply"],
            properties={
                "reply": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Admin reply message"
                )
            }
        )
    )
    def patch(self, request, message_id):

        if not request.user.is_super_admin:
            return Response(
                {"error": "Only Super Admin can reply."},
                status=403
            )

        message = get_object_or_404(
            ContactMessage,
            id=message_id
        )

        reply_text = request.data.get("reply")

        message.reply = reply_text
        message.is_read = True
        message.save()


        send_mail(
            subject="Reply from DigitalShop Support",
            message=reply_text,
            from_email=None,
            recipient_list=[message.email],
        )


        return Response({
            "message": "Reply sent successfully"
        })