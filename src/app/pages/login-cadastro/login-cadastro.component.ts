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

    if (sign_up_btn && sign_in_btn && container) {
      sign_up_btn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
      });
    
      sign_in_btn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
      });
    }
  }
}