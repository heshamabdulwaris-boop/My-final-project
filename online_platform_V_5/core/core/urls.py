"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from users.views import register_user
from users.views import login_user
# from users.views import create_product
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from django.conf import settings                #media uploading
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
schema_view = get_schema_view()

schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version='v1',
        description="API for my project",
    ),
    public=True,
    permission_classes=[permissions.AllowAny,],
)

urlpatterns = [
    path('api/', include('users.urls')),

    path('admin/', admin.site.urls),
    path('api/register/', register_user),
    path('api/login/', login_user),
    # path('api/add_product/', create_product),
    path('accounts/', include('allauth.urls')),

    path("api/orders/", include("orders.urls")),

    path("api/cart/", include("cart.urls")),

    path('admin-api/', include('adminpanel.urls')),

    path('api/products/', include('products.urls')),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)