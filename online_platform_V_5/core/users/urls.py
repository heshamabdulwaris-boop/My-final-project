from django.urls import path
from .views import (login_user, register_user, update_profile, password_reset_request, password_reset_confirm,
                    google_login,ProfileView, ChangeUserRoleView, contact_message, ContactMessageListView, ContactMessageReplyView)

urlpatterns = [
    path('login/', login_user),
    path('register/', register_user),
    path('profile/update/', update_profile),
    path('password-reset-request/', password_reset_request),
    path('password-reset-confirm/', password_reset_confirm),
    path('google/', google_login),
    path('profile/', ProfileView.as_view()),
    path('change-role/<int:user_id>', ChangeUserRoleView.as_view()),
    path('contact/', contact_message, name='contact'),
    path('contact-message/', ContactMessageListView.as_view(), name='contact_message'),
    path('contact-message/<int:message_id>/reply/', ContactMessageReplyView.as_view(), name='contact_message_reply'),
]