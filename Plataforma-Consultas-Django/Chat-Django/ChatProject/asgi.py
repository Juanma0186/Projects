# Asynchronous Server Gateway Interface, es un estándar que permite a tu aplicación Django manejar solicitudes asíncronas, como las conexiones WebSocket 
import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

from channels.auth import AuthMiddlewareStack
import ChatApp.routing  

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ChatProject.settings')  


application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(ChatApp.routing.websocket_urlpatterns)  
    )
})
