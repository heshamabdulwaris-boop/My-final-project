from .models import Order, OrderItem
from cart.models import CartItem
from decimal import Decimal

import requests
from django.conf import settings


def create_order_from_cart(user):
    cart_items = CartItem.objects.filter(user=user)

    if not cart_items.exists():
        return None

    order = Order.objects.create(
        user=user,
        status=Order.Status.PENDING,
        total_price=0
    )

    total = 0

    for item in cart_items:
        product = item.product

        platform_fee = (product.price * Decimal("0.05")).quantize(
            Decimal("0.01")
        )

        seller_amount = product.price - platform_fee

        OrderItem.objects.create(
            order=order,
            product=product,
            price=product.price,
            seller=product.seller,
            seller_amount=seller_amount,
            platform_fee=platform_fee,
        )

        total += product.price

    order.total_price = total
    order.save()

    cart_items.delete()

    return order


# PayPal
def get_paypal_access_token():

    url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"

    response = requests.post(
        url,
        auth=(
            settings.PAYPAL_CLIENT_ID,
            settings.PAYPAL_SECRET
        ),
        headers={
            "Accept": "application/json",
            "Accept-Language": "en_US",
        },
        data={
            "grant_type": "client_credentials"
        }
    )

    response.raise_for_status()

    return response.json()["access_token"]


def create_paypal_order(order):

    access_token = get_paypal_access_token()

    url = "https://api-m.sandbox.paypal.com/v2/checkout/orders"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    data = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": str(order.total_price)
                }
            }
        ]
    }

    response = requests.post(
        url,
        json=data,
        headers=headers
    )
    print(response.json())

    response.raise_for_status()

    return response.json()


def capture_paypal_order(paypal_order_id):

    access_token = get_paypal_access_token()

    url = f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{paypal_order_id}/capture"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.post(
        url,
        headers=headers
    )
    print(response.status_code)
    print(response.json())

    response.raise_for_status()

    return response.json()