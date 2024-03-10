from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    name = models.CharField(max_length=255,default='Chat') 
    participants = models.ManyToManyField(User, related_name='chats', verbose_name='Participantes')
    is_group_chat = models.BooleanField(default=False, verbose_name='Es chat grupal')

    def __str__(self):
        return f"{'Grupo' if self.is_group_chat else 'Chat'} con ID {self.id}"

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages', verbose_name='Chat')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages', verbose_name='Remitente')
    content = models.TextField(verbose_name='Contenido')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')

    def __str__(self):
        return self.content

    class Meta:
        ordering = ['timestamp']
        verbose_name = 'Mensaje'