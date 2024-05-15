import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
import { Subject, debounceTime } from 'rxjs';
import { Chat } from 'src/app/core/models/chat.models';
import { Mensagem } from 'src/app/core/models/mensagem.models';
import { ChatService } from 'src/app/core/services/chat.service';
import { NecessidadeService } from 'src/app/core/services/necessidade.service';
import { UserService } from 'src/app/core/services/user.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';

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

  private mensagemEnviada = new Subject<string>();

  constructor(
    private necessidadeService: NecessidadeService,
    private chatService: ChatService,
    private webSocketService: WebsocketService,
    private userService: UserService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.nomeUsuario = this.userService.dadosLogin.getValue()?.body?.usuarioLogado;

    const mensagemEnviadaDebounce = this.mensagemEnviada.pipe(debounceTime(200));

    mensagemEnviadaDebounce.subscribe({
      next: (value) => {
        this.webSocketService.enviarMensagem({
          idChat: this.chatSelecionado!.id!,
          texto: value,
          origemMensagem: 'USUARIO_ABERTURA'
        }).subscribe({
          complete: () => {
            this.mensagemFormControl.setValue('');
          }
        });
      }
    })

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

  carregarMeusChats(newChatId?: number) {
    this.chatService.meusChats().subscribe({
      next: (response) => {
        this.topicos = response.body
          .filter(c => c.idNecessidade === this.idNecessidadeSelecionada);
        if(newChatId) {
          this.chatSelecionado = this.topicos.find(t => t.id === newChatId);
        }
      }
    });
  }

  criarChat(chat: Chat) {
    this.chatService.criar({idNecessidade: this.idNecessidadeSelecionada, tipoAssistente: 'IA', titulo: chat.titulo!})
      .subscribe({
        next: (response) => {

          const urlArr = response.headers.get('Location')?.split('/');

          const newChatId = Number(urlArr?.pop());

          this.carregarMeusChats(newChatId);

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
      this.mensagemEnviada.next(this.mensagemFormControl.value);
    }
  }

}
