import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { LoginService } from '../../services/login.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: { user: string; content: string }[] = [];
  chatForm: FormGroup = new FormGroup({
    message: new FormControl(''),
  });

  constructor(
    private chatService: ChatService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    // Crear el formulario de chat
    this.chatForm = new FormGroup({
      message: new FormControl(''),
    });

    // Obtener el token del localStorage
    const token = localStorage.getItem('currentUser');
    if (token) {
      // Obtener los datos del usuario utilizando el token
      this.loginService.getUserAutenticado(token).subscribe((user) => {
        if (user) {
          // Determinar el ID del chat basándose en el rol del usuario
          let chatId = this.getChatId(user.rol);

          // Conectar al chat y suscribirse a los mensajes
          if (!this.chatService.isConnected(user.rol)) {
            // Solo suscribirse si no se ha suscrito antes
            this.chatService.connect(
              'ws://localhost:8001/ws/chat/' + chatId + '/',
              user.rol
            );
            this.chatService.getMessages(user.rol).subscribe((msg) => {
              const message = msg.message;
              const user = msg.user;
              const type = msg.type;
              if (type === 'join_chat' || message !== 'ping') {
                this.messages.push({ user: user, content: message });
              }
            });
          }
        }
      });
    }
  }

  //? Este método envía un mensaje a través de la conexión WebSocket de un usuario
  sendMessage() {
    const token = localStorage.getItem('currentUser');
    if (token) {
      this.loginService.getUserAutenticado(token).subscribe((user) => {
        if (user) {
          const message = this.chatForm.get('message')?.value;
          let chatId = this.getChatId(user.rol);
          this.chatService.send(user.rol, {
            message: message,
            target: chatId,
            user: user.rol,
          });
          this.chatForm.reset();
        }
      });
    }
  }

  //? Este método cierra la conexión WebSocket de un usuario y elimina la referencia a esa conexión del objeto sockets.
  ngOnDestroy() {
    const token = localStorage.getItem('currentUser');
    if (token) {
      this.loginService.getUserAutenticado(token).subscribe((user) => {
        if (user) {
          this.chatService.close(user.rol);
        }
      });
    }
  }

  //! Obtener el ID del chat basándose en el rol del usuario
  getChatId(role: string): string {
    switch (role) {
      case 'ciudadano':
        return '14';
      case 'banco':
        return '15';
      case 'promotor':
        return '16';
      default:
        return '0';
    }
  }

  toggleChat() {
    const chat = document.getElementById('chat')!;
    const chatIcon = document.getElementById('chatIcon')!;
    if (!chat.classList.contains('hidden')) {
      chatIcon.textContent = 'chat';
      chatIcon.classList.remove('text-red-500');
      chat.classList.add('animate-fade-up', 'animate-reverse');
      setTimeout(() => {
        chat.classList.add('hidden');
        chat.classList.remove('animate-fade-up', 'animate-reverse');
      }, 1000);
      console.log('ocultando chat');
    } else {
      chatIcon.textContent = 'close';
      chatIcon.classList.add('text-red-500');
      chat.classList.add('animate-fade-up');
      chat.classList.remove('hidden');
      chat.classList.add('flex');
      setTimeout(() => {
        chat.classList.remove('animate-fade-up');
      }, 800);
      console.log('mostrando chat');
    }
  }
}
