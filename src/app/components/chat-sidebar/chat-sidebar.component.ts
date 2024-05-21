import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Chat } from 'src/app/core/models/chat.models';
import { ChatService } from 'src/app/core/services/chat.service';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent implements OnInit, OnChanges {

  @Input()
  topicos: Chat[] = [];

  @Input()
  idChatSelecionado?: number | undefined

  @Output()
  onChatSelecionado: EventEmitter<Chat> = new EventEmitter();

  @Output()
  onTituloCriado: EventEmitter<Chat> = new EventEmitter();

  topicosFiltrados: Chat[] = [];

  pesquisaFormControl: FormControl = new FormControl('');
  novaConversaFormControl: FormControl = new FormControl('', Validators.required);

  submitted: boolean = false;

  tituloChatVisivel: boolean = false;

  constructor(
    private chatService: ChatService
  ) { }

  ngOnChanges(_: SimpleChanges): void {
    this.topicosFiltrados = [...this.topicos];
  }

  ngOnInit(): void {
    this.pesquisaFormControl.valueChanges.subscribe({
      next: (value: string) => {
        if (value) {
          this.topicosFiltrados = this.topicos.filter(t => t.titulo!.toLowerCase().trim().includes(value.toLowerCase().trim()));
        } else {
          this.topicosFiltrados = [...this.topicos];
        }
      }
    });
  }

  selecionarChat(chat: Chat) {
    this.onChatSelecionado.emit(chat);
    this.pesquisaFormControl.reset();
  }

  criarChat() {
    this.submitted = true;
    if (this.novaConversaFormControl.valid) {
      const chat: Chat = {
        titulo: this.novaConversaFormControl.value
      };
      this.onTituloCriado.emit(chat);
      this.tituloChatVisivel = false;
      this.novaConversaFormControl.reset();
      this.submitted = false;
    }
  }

}
