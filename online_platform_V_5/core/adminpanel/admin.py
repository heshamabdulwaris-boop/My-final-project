from django.contrib import admin
from .models import AdminLog


@admin.register(AdminLog)
class AdminLogAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "admin",
        "action",
        "target",
        "created_at",
    )

    search_fields = (
        "admin__username",
        "target",
        "action",
    )

    list_filter = (
        "action",
        "created_at",
    )

    ordering = (
        "-created_at",
    )