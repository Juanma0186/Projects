from django.urls import path
from .views import home, chat, create_chat, join_chat, all_chats,all_users

urlpatterns = [
    path('', home, name='home'),
    path('chat/<int:chat_id>',chat, name='chat'),
    # path('create_chat/<int:other_user_id>', create_chat, name='create_chat'),  # Ruta para crear un chat
    path('join_chat/<int:chat_id>', join_chat, name='join_chat'),  # Ruta para unirse a un chat
    path('all_chats/', all_chats, name='all_chats'),
    path('all_users/', all_users, name='all_users'),
    path('create_chat/<int:other_user_id>/<str:name_chat>/', create_chat, name='create_chat'),
    
]
