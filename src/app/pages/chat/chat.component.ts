import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
import { Subject, debounceTime, delay } from 'rxjs';
import { Chat } from 'src/app/core/models/chat.models';
import { Mensagem } from 'src/app/core/models/mensagem.models';
import { ChatService } from 'src/app/core/services/chat.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NecessidadeService } from 'src/app/core/services/necessidade.service';
import { UserService } from 'src/app/core/services/user.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

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

  submitted: boolean = false;

  isLoading: boolean = false;

  private mensagemEnviada = new Subject<string>();

  constructor(
    private loadingService: LoadingService,
    private chatService: ChatService,
    private webSocketService: WebsocketService,
    private userService: UserService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
      this.loadingService.loadingSub.unsubscribe();
  }

  ngOnInit(): void {
    
    this.nomeUsuario = this.userService.dadosLogin.getValue()?.body?.usuarioLogado;

    this.loadingService.loadingSub.pipe(delay(0))
      .subscribe((loading) => {
        this.isLoading = loading;
      })

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
            this.submitted = false;
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
    this.submitted = true;
    if (this.mensagemFormControl.valid) {
      this.mensagemEnviada.next(this.mensagemFormControl.value);
    }
  }

}
