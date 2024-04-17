import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario.models';

export type DadosLogin = {
  cpf: string,
  senha: string,
  email?: string
}

export type RespostaLogin = {
  body: {
    permissoes: string[],
    usuarioLogado: string,
    token: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  dadosLogin: BehaviorSubject<RespostaLogin> = new BehaviorSubject({} as RespostaLogin);

  constructor(private http: HttpClient) {
    const dadosLoginLocalStorage = localStorage.getItem('dadosLogin');
    if (dadosLoginLocalStorage) {
      const dadosLoginObjeto = JSON.parse(dadosLoginLocalStorage);
      this.dadosLogin?.next(dadosLoginObjeto);
      console.log(this.dadosLogin.value);
    }
  }

  autenticar(dadosLogin: DadosLogin) {
    return this.http.post<RespostaLogin>(`${environment.target}/auth/token`, dadosLogin);
  }

  cadastrarCasual(usuario: Usuario) {
    return this.http.post(`${environment.target}/casual`, usuario);
  }

}
