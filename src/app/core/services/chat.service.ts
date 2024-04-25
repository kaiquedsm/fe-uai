import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Chat } from '../models/chat.models';

type ChatPost = {
  idNecessidade: number,
  tipoAssistente: 'IA'
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  meusChats() {
    return this.http.get<{body: Chat[]}>(`${environment.target}/chat/meus-chats`);
  }

  criar(payload: ChatPost) {
    return this.http.post(`${environment.target}/chat`, payload);
  } 

}
