import { Location } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login-cadastro',
  templateUrl: './login-cadastro.component.html',
  styleUrls: ['./login-cadastro.component.scss']
})
export class LoginCadastroComponent implements OnInit {

  /**
   * Campos login
   */
  cpfFormControl: FormControl = new FormControl<string>('', [Validators.required]);
  senhaFormControl: FormControl = new FormControl<string>('', [Validators.required]);

  /**
   * Form cadastro
   */
  formBuilder: FormBuilder = new FormBuilder();
  cadastroForm!: FormGroup;

  enviadoLogin: boolean = false;

  enviadoCadastro: boolean = false;

  cadastro: boolean = false;
  mostrarSenha: boolean = false;

  isLoading: boolean = false;

  constructor(private userService: UserService, private loadingService: LoadingService, private router: Router, private location: Location) {

  }

  ngOnInit(): void {

    this.loadingService.loadingSub.pipe(delay(0))
      .subscribe((loading) => {
        this.isLoading = loading;
      });

    this.cadastroForm = this.formBuilder.group({
      nomeCompleto: [null, Validators.required],
      dataNascimento: [null, Validators.required],
      cpf: [null, Validators.required],
      senha: [null, Validators.required],
      email: [null],
      termosUso: [null, Validators.requiredTrue]
    })

  }

  login() {
    this.enviadoLogin = true;
    if (this.cpfFormControl.valid && this.senhaFormControl.valid) {
      const dadosLogin = {
        cpf: this.cpfFormControl.value,
        senha: this.senhaFormControl.value
      };
      this.userService.autenticar(dadosLogin).subscribe({
        next: (response) => {
          localStorage.setItem('dadosLogin', JSON.stringify(response)); // Salvei os dados do login no localStorage.
          this.userService.dadosLogin.next(response);
          this.router.navigate(['/modulo']); // Aqui eu redireciono o usuário de volta pra home se deu certo. Quando a próxima tela depois do login estiver pronta, deve ser redirecionado pra lá.
        },
        error: (err:
          {
            error: {
              message: string,
              uri?: string,
              body?: {
                senha?: string,
                cpf?: string
              }
            }
          }) => {
          console.log(err.error.message);
          console.log(err.error.uri ?? err.error.body?.senha ?? err.error.body?.cpf);
        }
      })
    }


  }

  cadastrar() {
    this.enviadoCadastro = true;
    if (this.cadastroForm.valid) {
      this.userService.cadastrarCasual({ ...this.cadastroForm.value }).subscribe({
        next: _ => {
          this.cpfFormControl.patchValue(this.cadastroForm.get('cpf')!.value);
          this.senhaFormControl.patchValue(this.cadastroForm.get('senha')!.value);
          this.cadastro = false;
          this.moveScroll();
        }
      })
    }
  }

  moveScroll() {
    if (window.innerWidth < 1000) {
      if (this.cadastro) {
        document.getElementById('container')!.scrollTop = document.getElementById('container')!.scrollHeight / 1.8;
      } else {
        document.getElementById('container')!.scrollTop = 0;
      }
    }
  }

  goBackOneSCreen() {
    this.location.back();
  }

}