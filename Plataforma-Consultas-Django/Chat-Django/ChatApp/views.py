from django.http import HttpResponse
from django.shortcuts import render
from django.shortcuts import get_object_or_404, redirect
from .models import Chat
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.views import generic
from django.contrib.auth.models import User

# Create your views here.

@login_required
def home(request):
    chats = Chat.objects.filter(participants=request.user)
    return render(request, 'chat/home.html', {'chats':chats})
  
def all_chats(request):
    chats = Chat.objects.all()
    return render(request, 'chat/all_chats.html', {'chats':chats})
  
def all_users(request):
    # Obtén todos los usuarios
    users = User.objects.all()
    return render(request, 'chat/all_users.html', {'users':users})

  
# @login_required
def chat(request, chat_id):
    chat = get_object_or_404(Chat, id=chat_id)  # Obtiene el chat o devuelve un error 404 si no existe
    user_is_participant = request.user.chats.filter(id=chat.id).exists()  # Comprueba si el usuario es un participante en el chat
    if user_is_participant:
        messages = chat.messages.order_by('timestamp')  # Obtener todos los mensajes del chat
        return render(request, 'chat/chat.html', {'chat':chat, 'messages':messages, 'user_is_participant': user_is_participant})
    else:
        return render(request, 'chat/join_chat.html', {'chat':chat, 'user_is_participant': user_is_participant})  
    
# @login_required
def create_chat(request, other_user_id,name_chat):
    # Crear el nombre del chat
    name_chat = f"{request.user.username} y {name_chat}"

    # Crear una nueva instancia de Chat
    chat = Chat.objects.create(name=name_chat,is_group_chat=False)  # Establecer is_group_chat a False para un chat individual

    # Añadir el usuario actual y el otro usuario como participantes en el chat
    other_user = User.objects.get(id=other_user_id)
    chat.participants.add(request.user, other_user)

    # Redirigir al usuario a la página del chat
    return redirect('chat', chat_id=chat.id)

def join_chat(request, chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    if chat.is_group_chat or chat.participants.count() < 2:
        chat.participants.add(request.user)
        
    else:
        return HttpResponse("No puedes unirte a este chat porque ya tiene dos participantes.")
