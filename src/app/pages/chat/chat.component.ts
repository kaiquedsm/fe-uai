import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Chat } from 'src/app/core/models/chat.models';
import { Mensagem } from 'src/app/core/models/mensagem.models';
import { ChatService } from 'src/app/core/services/chat.service';
import { NecessidadeService } from 'src/app/core/services/necessidade.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatSelecionado?: Chat

  mensagemFormControl: FormControl = new FormControl('', Validators.required);

  topicos: Chat[] = [

  ];

  mensagens: Mensagem[] = [];

  constructor(
    private necessidadeService: NecessidadeService,
    private chatService: ChatService,
    private webSocketService: WebsocketService
  ) { }

  ngOnInit(): void {
    this.necessidadeService.listarNecessidade().subscribe({
      next: (necessidade) => {
        this.chatService.criar({ idNecessidade: necessidade.id, tipoAssistente: 'IA' })
          .subscribe({
            next: (_) => {
              this.chatService.meusChats().subscribe({
                next: (response) => {
                  this.topicos = response.body;
                  this.chatSelecionado = this.topicos[0];
                  this.webSocketService.connect(this.chatSelecionado.id);
                  this.webSocketService.mensagemRespostaSubject.subscribe({
                    next: (resposta) => {
                      if(resposta.texto) {
                        this.mensagens.push(resposta);
                      }
                    }
                  })
                },
              });
            }
          })
      }
    });

  }

  enviarMensagem() {
    if(this.mensagemFormControl.valid) {
      this.webSocketService.enviarMensagem({
        idChat: this.chatSelecionado!.id,
        texto: this.mensagemFormControl.value,
        origemMensagem: 'USUARIO_ABERTURA'
      }).subscribe();
    }
  }

}
