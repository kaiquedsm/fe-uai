import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-cadastro',
  templateUrl: './login-cadastro.component.html',
  styleUrls: ['./login-cadastro.component.scss']
})
export class LoginCadastroComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
    const sign_in_btn = document.querySelector<HTMLButtonElement>("#sign-in-btn");
    const sign_up_btn = document.querySelector<HTMLButtonElement>("#sign-up-btn");
    const container = document.querySelector<HTMLElement>(".container");

    const inputSenhaCadastro = document.getElementById("senhaCadastro") as HTMLInputElement;
    const inputSenha = document.getElementById("senha") as HTMLInputElement;
    const olhoAbertoLogin = document.getElementById("olho-aberto-login") as HTMLElement;
    const olhoFechadoLogin = document.getElementById("olho-fechado-login") as HTMLElement;
    const olhoAbertoCadastro = document.getElementById("olho-aberto-cadastro") as HTMLElement;
    const olhoFechadoCadastro = document.getElementById("olho-fechado-cadastro") as HTMLElement;

    if (sign_up_btn && sign_in_btn && container) {
      sign_up_btn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
      });
    
      sign_in_btn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
      });
    }

    // input senha form login
    olhoAbertoLogin?.addEventListener("click", () => {
      olhoFechadoLogin.style.display = "block";
      olhoAbertoLogin.style.display = "none";
      inputSenha.type = "text";
    });

    olhoFechadoLogin?.addEventListener("click", () => {
      olhoAbertoLogin.style.display = "block";
      olhoFechadoLogin.style.display = "none";
      inputSenha.type = "password";
    });

    // mudança de senha form cadastro
    olhoAbertoCadastro?.addEventListener("click", () => {
      olhoFechadoCadastro.style.display = "block";
      olhoAbertoCadastro.style.display = "none";
      inputSenhaCadastro.type = "text";
    });

    olhoFechadoCadastro?.addEventListener("click", () => {
      olhoAbertoCadastro.style.display = "block";
      olhoFechadoCadastro.style.display = "none";
      inputSenhaCadastro.type = "password";
    });
  }
}