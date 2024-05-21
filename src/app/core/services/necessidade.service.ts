import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

type Necessidade = {
  id: number,
  nome: string,
  descricao: string,
  dataCriacao: string
}

@Injectable({
  providedIn: 'root'
})
export class NecessidadeService {

  constructor(private http: HttpClient) { }

  // Provisório
  listarNecessidade() {
    return this.http.get<{ body: Necessidade[] }>(`${environment.target}/necessidade`);
  }

  listarNecessidades() {
    return this.http.get(`${environment.target}/necessidade`);
  }

}
