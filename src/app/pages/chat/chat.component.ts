import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Chat } from 'src/app/core/models/chat.models';
import { Mensagem } from 'src/app/core/models/mensagem.models';
import { ChatService } from 'src/app/core/services/chat.service';
import { NecessidadeService } from 'src/app/core/services/necessidade.service';
import { UserService } from 'src/app/core/services/user.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild('chatbox') chatbox!: ElementRef<any>;

  bars = faBars;
  close = faClose;

  chatSelecionado?: Chat
  idNecessidadeSelecionada!: number;
  nomeUsuario?: string;

  topicos: Chat[] = [];
  mensagens: Mensagem[] = [];

  sidebarHabilitada: boolean = false;

  mensagemFormControl: FormControl = new FormControl('', Validators.required);

  constructor(
    private necessidadeService: NecessidadeService,
    private chatService: ChatService,
    private webSocketService: WebsocketService,
    private userService: UserService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.nomeUsuario = this.userService.dadosLogin.getValue()?.body?.usuarioLogado;
    this.activeRoute.params.subscribe({
      next: (params) => {
        this.idNecessidadeSelecionada = Number(params['idNecessidade']);
        this.carregarMeusChats();
      }
    });
    
    this.webSocketService.mensagemRespostaSubject.subscribe({
      next: (resposta) => {
        if (resposta.texto) {
          this.mensagens.push(resposta);
          setTimeout(() => {
            this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
          }, 200)
        }
      },
    })
  }

  carregarMeusChats() {
    this.chatService.meusChats().subscribe({
      next: (response) => {
        this.topicos = response.body
          .filter(c => c.idNecessidade === this.idNecessidadeSelecionada);
      }
    });
  }

  criarChat(chat: Chat) {
    this.chatService.criar({idNecessidade: this.idNecessidadeSelecionada, tipoAssistente: 'IA', titulo: chat.titulo!})
      .subscribe({
        next: (response) => {

          this.carregarMeusChats();

          const urlArr = response.headers.get('Location')?.split('/');

          const newChatId = Number(urlArr?.pop());

          this.chatSelecionado = {
            id: newChatId
          };

          this.webSocketService.connect(newChatId);

          this.mensagens = [];

        }
      })
  }

  carregarMensagens(chat: Chat) {
    this.chatSelecionado = {...chat};
    this.mensagens = [];
    this.webSocketService.connect(chat.id!);
    this.chatService.carregarMensagens(chat.id!).subscribe({
      next: (response) => {
        this.mensagens = response.body;
        this.sidebarHabilitada = false;
        setTimeout(() => {
          this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
        }, 200)
      }
    });
  }

  enviarMensagem() {
    if (this.mensagemFormControl.valid) {
      this.webSocketService.enviarMensagem({
        idChat: this.chatSelecionado!.id!,
        texto: this.mensagemFormControl.value,
        origemMensagem: 'USUARIO_ABERTURA'
      }).subscribe({
        complete: () => {
          this.mensagemFormControl.setValue('');
        }
      });
    }
  }

}
