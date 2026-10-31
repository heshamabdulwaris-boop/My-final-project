from django.urls import path
from .views import AddToCartView, CartView, RemoveFromCartView

urlpatterns = [
    path("add/", AddToCartView.as_view()),
    path("", CartView.as_view()),
    path("remove/", RemoveFromCartView.as_view()),
]