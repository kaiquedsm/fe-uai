import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Chat } from '../models/chat.models';
import { Mensagem } from '../models/mensagem.models';

type ChatPost = {
  idNecessidade: number,
  titulo: string,
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
    return this.http.post(`${environment.target}/chat`, payload, {observe: 'response'});
  }

  carregarMensagens(chatId: number) {
    return this.http.get<{body: Mensagem[]}>(`${environment.target}/mensagem/chat/${chatId}`);
  }

}
