import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Mensagem } from '../models/mensagem.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private _mensagemRespostaSubject: BehaviorSubject<Mensagem> = new BehaviorSubject({} as Mensagem);
  private _socket?: WebSocket;
  private _client?: Stomp.CompatClient

  constructor(private http: HttpClient) { }

  connect(idChat: number) {
    this._socket = new SockJS(`${environment.target}/live-chat`);
    this._client = Stomp.Stomp.over(this._socket);

    this._client.activate();

    this._client.reconnectDelay = 1000;

    this._client.connect({}, (frame: any) => {
      this._client!.subscribe(`/topic/chat/${idChat}`, (imessage: Stomp.IMessage) => {
        const message: Mensagem = JSON.parse(imessage.body);
        this._mensagemRespostaSubject.next(message);
      });
    });

    this._client.onWebSocketError(() => {
      this._client?.deactivate();
    })

  }

  enviarMensagem(mensagem: Mensagem) {
    return this.http.post(`${environment.target}/mensagem`, mensagem);
  }

  
  public get mensagemRespostaSubject() : BehaviorSubject<Mensagem> {
    return this._mensagemRespostaSubject;
  }
  

}
