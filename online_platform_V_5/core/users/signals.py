from allauth.account.signals import user_signed_up
from django.dispatch import receiver

@receiver(user_signed_up)
def set_default_role(request, user, **kwargs):
    user.role = 'buyer'
    user.save()