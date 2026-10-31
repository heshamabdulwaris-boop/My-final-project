from django.urls import path
from .views import create_product, list_products, DownloadProductView, PurchasedProductsView, SellerDashboardView, \
    MyProductsView, UpdateProductView, DeleteProductView, SellerSalesHistoryView, product_detail, \
    TopSellingProductsView, MyDownloadsView, ApproveProductView, PendingProductsView, RejectProductView

urlpatterns = [
    path('', list_products),
    path('create/', create_product),
    path('<int:product_id>/', product_detail),
    path("download/<int:product_id>/", DownloadProductView.as_view()),
    path("my-purchased/", PurchasedProductsView.as_view()),
    path("seller-dashboard/", SellerDashboardView.as_view()),
    path("my-products/", MyProductsView.as_view()),
    path("edit/<int:product_id>/", UpdateProductView.as_view()),
    path("delete/<int:product_id>/", DeleteProductView.as_view()),
    path("seller/sales", SellerSalesHistoryView.as_view()),
    path("top-selling/", TopSellingProductsView.as_view()),
    path("my-downloads/", MyDownloadsView.as_view()),
    path("approve/<int:product_id>/", ApproveProductView.as_view()),
    path("pending/", PendingProductsView.as_view()),
    path("reject/<int:product_id>/", RejectProductView.as_view()),
]