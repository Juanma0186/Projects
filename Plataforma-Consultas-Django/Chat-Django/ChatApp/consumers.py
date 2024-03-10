from channels.generic.websocket import WebsocketConsumer
from .models import Chat, Message
from django.contrib.auth.models import User
from channels.exceptions import StopConsumer

import json

# Almacenamiento global de conexiones
connections = {}


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

        # Guardar la conexión usando el chat_id como ID
        chat_id = self.scope['url_route']['kwargs']['chat_id']
        if chat_id not in connections:
            connections[chat_id] = []
        connections[chat_id].append(self)

    def disconnect(self, close_code):
        # Eliminar la conexión al desconectar
        chat_id = self.scope['url_route']['kwargs']['chat_id']
        if chat_id in connections:
            connections[chat_id].remove(self)
            
        # Levanta la excepción StopConsumer para detener el consumidor
        raise StopConsumer()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        user = text_data_json['user']
        chat_id = self.scope['url_route']['kwargs']['chat_id']
        message_type = text_data_json.get('type')

        # Solo guardar el mensaje en la base de datos si no es 'ping'
        if message_type == 'join_chat':
            self.join_chat(user, chat_id)
        elif message != 'ping':
            chat = Chat.objects.get(id=chat_id)
            user_obj = User.objects.get(username=user)
            Message.objects.create(chat=chat, sender=user_obj, content=message)

            # Enviar el mensaje a todos en el chat
            if chat_id in connections:
                for connection in connections[chat_id]:
                    connection.send(text_data=json.dumps({
                        'message': message,
                        'user': user
                    }))

    def join_chat(self, user, chat_id):
        # Aquí podrías añadir al usuario al chat en tu base de datos
        chat = Chat.objects.get(id=chat_id)
        user_obj = User.objects.get(username=user)
        chat.participants.add(user_obj)

        # Y luego podrías enviar un mensaje a todos en el chat para indicar que el usuario se ha unido
        if chat_id in connections:
            for connection in connections[chat_id]:
                connection.send(text_data=json.dumps({
                    'message': f'{user} se ha unido al chat',
                    'user': ' '
                }))


    def create_chat(self, other_user_id, name_chat):
        # ? Crear el nombre del chat
        name_chat = f"{self.scope['user'].username} y {name_chat}"

        # ? Crear una nueva instancia de Chat
        # Establecer is_group_chat a False para un chat individual
        chat = Chat.objects.create(name=name_chat, is_group_chat=False)

        # ? Añadir el usuario actual y el otro usuario como participantes en el chat
        other_user = User.objects.get(id=other_user_id)
        chat.participants.add(self.scope['user'], other_user)

        # ? Enviar un mensaje al cliente para confirmar la creación del chat
        self.send(text_data=json.dumps({
            'message': f'Chat "{name_chat}" creado con éxito.',
            'chat_id': chat.id
        }))
