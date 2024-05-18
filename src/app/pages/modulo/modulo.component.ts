import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Necessidade } from 'src/app/core/models/necessidade.models';
import { NecessidadeService } from 'src/app/core/services/necessidade.service';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss']
})
export class ModuloComponent implements OnInit {

  habiltarInputModulo = false;
  moduloEducacao: Necessidade = {} as Necessidade;
  nomeNovoChat: FormControl = new FormControl(null, Validators.required);

  constructor(private necessidadeService: NecessidadeService,
    private router: Router) {
    this.necessidadeService.listarNecessidade().subscribe({
      next: (response) => this.moduloEducacao = response,
      error: (exception) => console.error(exception)
    });
  }

  ngOnInit(): void {
  }

  habilitarInput() {
    this.habiltarInputModulo = true;
  }

}
