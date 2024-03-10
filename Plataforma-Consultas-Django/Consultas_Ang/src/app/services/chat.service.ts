import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private sockets: { [key: string]: WebSocketSubject<any> } = {};

  //?Este método establece una conexión WebSocket para un usuario a una URL específica. Si ya existe una conexión para ese usuario y no está cerrada, no se crea una nueva
  public connect(url: string, user: string): void {
    if (!this.sockets[user] || this.sockets[user].closed) {
      this.sockets[user] = webSocket(url);
    }
  }

  //?Este método verifica si un usuario está conectado a través de WebSocket.
  public isConnected(user: string): boolean {
    return this.sockets[user] && !this.sockets[user].closed;
  }

  //?Este método obtiene el usuario actual de localStorage.
  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('currentUser')!) as User;
  }

  //?Este método envía un mensaje a través de la conexión WebSocket de un usuario
  public send(user: string, message: any): void {
    this.sockets[user].next(message);
  }

  //?Este método cierra la conexión WebSocket de un usuario y elimina la referencia a esa conexión del objeto sockets.
  public close(user: string): void {
    this.sockets[user].complete();
    delete this.sockets[user];
  }

  //?Este método devuelve un observable que emite los mensajes recibidos a través de la conexión WebSocket de un usuario.
  public getMessages(user: string) {
    return this.sockets[user].asObservable();
  }

  //?Este método crea un nuevo chat con otro usuario.
  public createChat(user: string, otherUserId: string, chatName: string): void {
    this.sockets[user].next({ type: 'create_chat', user: user, other_user_id: otherUserId, name_chat: chatName });
  }
  
  
  
 
  
}