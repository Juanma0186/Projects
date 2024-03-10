from django.urls import path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    path('ws/chat/<chat_id>/', ChatConsumer.as_asgi()),
]