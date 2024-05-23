import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Chat } from 'src/app/core/models/chat.models';
import { Necessidade } from 'src/app/core/models/necessidade.models';
import { ChatService } from 'src/app/core/services/chat.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NecessidadeService } from 'src/app/core/services/necessidade.service';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss']
})
export class ModuloComponent implements OnInit {

  habiltarInputModulo = false;
  moduloEducacao: Necessidade = {} as Necessidade;
  idNecessidadeSelecionada?: number;

  pesquisaChatFormControl: FormControl = new FormControl('');
  tituloChatFormControl: FormControl = new FormControl('', Validators.required);

  chatsRecentes: Chat[] = [];
  chatsRecentesFiltrados: Chat[] = [];

  submitted: boolean = false;

  isLoading: boolean = false;

  rendered: boolean = false;

  close = faClose;

  novoChat: boolean = false;

  constructor(private necessidadeService: NecessidadeService,
    private chatService: ChatService,
    private loadingService: LoadingService,
    private router: Router) {
  }

  ngOnInit(): void {

    this.loadingService.loadingSub.subscribe({
      next: (loading) => {
        this.isLoading = loading;
        setTimeout(() => this.rendered = true, 1000)
      }
    })

    this.pesquisaChatFormControl.valueChanges.subscribe({
      next: (value: string) => {
        if (value) {
          this.chatsRecentesFiltrados = this.chatsRecentes.filter(c => c.titulo?.trim().toLowerCase().includes(value.trim().toLowerCase()));
        } else {
          this.chatsRecentesFiltrados = [...this.chatsRecentes];
        }
      }
    })

    this.necessidadeService.listarNecessidade().subscribe({
      next: (response) => this.moduloEducacao = response.body.filter(m => m.id === 1)[0],
    });
    this.chatService.meusChats().subscribe({
      next: (response) => {
        this.chatsRecentes = response.body;
        this.chatsRecentesFiltrados = [...this.chatsRecentes];
      }
    });
  }

  habilitarInput() {
    this.habiltarInputModulo = true;
  }

  criarChat() {
    this.submitted = true;
    if (this.tituloChatFormControl.valid) {
      this.chatService.criar({ idNecessidade: this.idNecessidadeSelecionada!, tipoAssistente: 'IA', titulo: this.tituloChatFormControl.value })
        .subscribe({
          next: (response) => {

            this.novoChat = false;
            this.submitted = false;

            const urlArr = response.headers.get('Location')?.split('/');
            const newChatId = Number(urlArr?.pop());

            this.router.navigate([`/chat/necessidade/${this.idNecessidadeSelecionada}`], {
              queryParams: {
                newChatId: newChatId
              }
            });

          }
        })
    }
  }

}
