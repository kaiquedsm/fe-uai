import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  pesquisaChatFormControl: FormControl = new FormControl('');

  chatsRecentes: Chat[] = [];
  chatsRecentesFiltrados: Chat[] = [];

  isLoading: boolean = false;

  constructor(private necessidadeService: NecessidadeService,
    private chatService: ChatService,
    private loadingService: LoadingService,
    private router: Router) {
  }

  ngOnInit(): void {

    this.loadingService.loadingSub.subscribe({
      next: (loading) => {
        this.isLoading = loading;
      }
    })

    this.pesquisaChatFormControl.valueChanges.subscribe({
      next: (value: string) => {
        if(value) {
          this.chatsRecentesFiltrados = this.chatsRecentes.filter(c => c.titulo?.trim().toLowerCase().includes(value.trim().toLowerCase()));
        } else {
          this.chatsRecentesFiltrados = [...this.chatsRecentes];
        }
      }
    })

    this.necessidadeService.listarNecessidade().subscribe({
      next: (response) => this.moduloEducacao = response.body.filter(m => m.id === 1)[0],
      error: (err) => {
        console.log(err);
      }
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

}
