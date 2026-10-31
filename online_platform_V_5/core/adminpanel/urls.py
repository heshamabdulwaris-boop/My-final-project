from django.urls import path

from .views import (AdminDashboardView, AdminUsersView, AdminProductsView, AdminOrdersView, AdminOrderDetailView,
                    SuspendUserView, ActivateUserView, AdminLogsView)
from .reports import TopSellersReport, TopProductsReport, RevenueReport, DownloadReport


urlpatterns = [
    path("dashboard/",AdminDashboardView.as_view()),
    path("users/",AdminUsersView.as_view()),
    path("products/", AdminProductsView.as_view(), name="admin-products"),
    path("orders/", AdminOrdersView.as_view(), name="admin-orders"),
    path("orders/<int:order_id>/",AdminOrderDetailView.as_view(), name="admin-order-detail"),
    path("reports/", TopSellersReport.as_view(), name="top-sellers-report"),
    path("reports/top-products/", TopProductsReport.as_view(), name="top-products-report"),
    path("reports/revenue/", RevenueReport.as_view(), name="revenue-report"),
    path("reports/download/", DownloadReport.as_view(), name="download-report"),
    path("users/<int:user_id>/suspend/", SuspendUserView.as_view(), name="suspend-users"),
    path("users/<int:user_id>/activate/", ActivateUserView.as_view(), name="activate-users"),
    path("logs/", AdminLogsView.as_view(), name="admin-logs"),

]