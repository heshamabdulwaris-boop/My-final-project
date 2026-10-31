from .models import AdminLog


def log_admin_action(
    admin,
    action,
    target,
    description=""
):
    AdminLog.objects.create(
        admin=admin,
        action=action,
        target=target,
        description=description
    )