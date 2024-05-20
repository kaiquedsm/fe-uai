import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
import { Subject, catchError, combineLatest, debounceTime, delay, of } from 'rxjs';
import { Chat } from 'src/app/core/models/chat.models';
import { Mensagem } from 'src/app/core/models/mensagem.models';
import { ChatService } from 'src/app/core/services/chat.service';
import { LoadingService } from 'src/app/core/services/loading.service';
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
          next: _ => {
            this.mensagemFormControl.setValue('');
          },
          complete: () => {
            this.submitted = false;
          }
        });
      }
    });

    combineLatest([
      this.activeRoute.params,
      this.activeRoute.queryParams.pipe(catchError(_=> of({message: 'newChatId param not found'})))
    ]).subscribe({
      next: ([path, query]) => {
        
        const isParams = (query: any): query is Params => {
          return (<Params>query)['newChatId'] !== undefined;
        }
        
        this.idNecessidadeSelecionada = Number(path['idNecessidade']);

        if(isParams(query)) {
          const chatId = Number((query as Params)['newChatId']);
          this.carregarMeusChats(chatId);
          this.carregarMensagens({id: chatId});
        } else {
          this.carregarMeusChats();
        }

      }
    })

    this.webSocketService.mensagemRespostaSubject.subscribe({
      next: (resposta) => {
        if (resposta.texto && this.mensagens.find(m => m.id == resposta.id) === undefined) {
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
