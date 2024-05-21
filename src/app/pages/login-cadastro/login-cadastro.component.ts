import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.cadastroUserValidators();
  }

  cadastroUserValidators() {
    this.cadastroForm = this.formBuilder.group({
      nomeCompleto: [null, [Validators.required, Validators.minLength(3)]],
      dataNascimento: [null, [Validators.required, Validators.maxLength(10)]],
      cpf: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(8)]],
      termosUso: [false, Validators.requiredTrue]
    })
  }


  login() {
    this.enviadoLogin = true;

    // Validar os campos CPF e senha
    if (this.cpfFormControl.valid && this.senhaFormControl.valid) {
      const dadosLogin = {
        cpf: this.cpfFormControl.value,
        senha: this.senhaFormControl.value
      };

      this.userService.autenticar(dadosLogin).subscribe({
        next: (response) => {
          localStorage.setItem('dadosLogin', JSON.stringify(response));
          this.userService.dadosLogin.next(response);
          this.router.navigate(['/']); // Redirecionar para a página inicial após o login
        },
        error: (err) => {
          console.log(err.error.message);
          console.log(err.error.uri ?? err.error.body?.senha ?? err.error.body?.cpf);
        }
      });
    } else {
      // Marcar os campos inválidos
      if (this.cpfFormControl.invalid) {
        this.cpfFormControl.markAsDirty();
        this.cpfFormControl.markAsTouched();
      }

      if (this.senhaFormControl.invalid) {
        this.senhaFormControl.markAsDirty();
        this.senhaFormControl.markAsTouched();
      }
    }
  }

  cadastrar() {
    this.enviadoCadastro = true;

    // Validar os campos do formulário de cadastro
    if (this.cadastroForm.valid) {
      const dataArr = (this.cadastroForm.get('dataNascimento')?.value as string).split('/');
      const dataAmericana = dataArr.reverse().join('-');

      if (this.validarIdadeMinima(dataAmericana)) {
        this.userService.cadastrarCasual({ ...this.cadastroForm.value, dataNascimento: dataAmericana }).subscribe({
          next: _ => {
            this.cpfFormControl.patchValue(this.cadastroForm.get('cpf')!.value);
            this.senhaFormControl.patchValue(this.cadastroForm.get('senha')!.value);
            this.cadastro = false;
            this.router.navigate(['/']); // Redirecionar para a página inicial após o cadastro
          },
          error: (err) => {
            console.log(err.error.message);
            console.log(err.error.uri ?? err.error.body?.cpf ?? err.error.body?.senha);
          }
        });
      } else {
        // Chamar o componente de erros
      }
    } else {
      // Marcar os campos inválidos
      Object.keys(this.cadastroForm.controls).forEach(key => {
        const control = this.cadastroForm.get(key);
        if (control && control.invalid) {
          control.markAsDirty();
          control.markAsTouched();
        }
      });
    }
  }

  /*   login() {
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
            this.router.navigate(['/']); // Aqui eu redireciono o usuário de volta pra home se deu certo. Quando a próxima tela depois do login estiver pronta, deve ser redirecionado pra lá.
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
  
  
    } */

  /*   cadastrar() {
      this.enviadoCadastro = true;
      if (this.cadastroForm.valid) {
  
        const dataArr = (this.cadastroForm.value.dataNascimento as string).split('/'); // [05, 10, 2005]
  
        const dataAmericana = dataArr.reverse().join('-');
  
        if (this.validarIdadeMinima(dataAmericana)) {
          this.userService.cadastrarCasual({ ...this.cadastroForm.value, dataNascimento: dataAmericana }).subscribe({
            next: _ => {
              this.cpfFormControl.patchValue(this.cadastroForm.get('cpf')!.value);
              this.senhaFormControl.patchValue(this.cadastroForm.get('senha')!.value);
              this.cadastro = false;
            }
          })
        } else {
          // chamar o componente de errors
        }
  
  
      }
    } */

  // formatação de nome

  formatNomeCompleto(event: Event) {
    const input = event.target as HTMLInputElement;
    let nomeCompleto = input.value;

    nomeCompleto = nomeCompleto.replace(/[^a-zA-Z\s]/g, '');

    input.value = nomeCompleto;
  }

  // Validação de idade mínima

  validarIdadeMinima(data: string): boolean {
    const dataNascimento = new Date(data);

    if (!dataNascimento || isNaN(dataNascimento.getTime())) {
      return false;
    }

    const dataAtual = new Date();
    const diffAnos = dataAtual.getFullYear() - dataNascimento.getFullYear();

    return diffAnos >= 12;

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

  // mapeamento de elementos HTML
  @ViewChild('nomeCompleto') nomeCompleto !: ElementRef | string;
  @ViewChild('dataNascimento') dataNascimento !: ElementRef;
  @ViewChild('cpf') cpf !: ElementRef;
  @ViewChild('email') email !: ElementRef;
  @ViewChild('senha') senha !: ElementRef;
}