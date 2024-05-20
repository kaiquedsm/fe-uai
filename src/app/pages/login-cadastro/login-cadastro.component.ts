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
      senha: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)]],
      termosUso: [false, Validators.requiredTrue]
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


  }

  cadastrar() {
    this.enviadoCadastro = true;
    if (this.cadastroForm.valid) {
      this.userService.cadastrarCasual({ ...this.cadastroForm.value }).subscribe({
        next: _ => {
          this.cpfFormControl.patchValue(this.cadastroForm.get('cpf')!.value);
          this.senhaFormControl.patchValue(this.cadastroForm.get('senha')!.value);
          this.cadastro = false;
        }
      })
    }
  }



  // CPF Validator

  cpfValidator(control: FormControl) {
    const cpf = control.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Verifica se o CPF possui 11 dígitos
    if (cpf.length !== 11) {
      return { cpfInvalid: true };
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
      return { cpfInvalid: true };
    }

    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(9, 10), 10)) {
      return { cpfInvalid: true };
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(10, 11), 10)) {
      return { cpfInvalid: true };
    }

    return null; // CPF válido
  }

  // formatação de nome

  formatNomeCompleto(event: Event) {
    const input = event.target as HTMLInputElement;
    let nomeCompleto = input.value;

    nomeCompleto = nomeCompleto.replace(/[^a-zA-Z\s]/g, '');

    input.value = nomeCompleto;
  }

  // Formatação de data

  formatDataNascimento(event: Event) {
    const input = event.target as HTMLInputElement;
    let date = input.value.replace(/\D/g, '');
    let dateMod = '';

    if (date.length > 0) {
      dateMod += date.slice(0, 2);
      if (date.length > 2) {
        dateMod += '/';
        dateMod += date.slice(2, 4);
        if (date.length > 4) {
          dateMod += '/';
          dateMod += date.slice(4);
        }
      }
    }

    input.value = dateMod;
  }

  // Aplicação de máscara CPF

  formatCPF(event: Event) {
    const input = event.target as HTMLInputElement;
    const cpf = input.value.replace(/\D/g, '');
    let cpfMod = cpf;


    if (cpfMod.length > 3 && cpfMod.length < 7) {
      cpfMod = cpfMod.replace(/(\d{3})(\d)/, '$1.$2');
    } else if (cpfMod.length >= 7 && cpfMod.length < 10) {
      cpfMod = cpfMod.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
    } else if (cpfMod.length >= 10) {
      cpfMod = cpfMod.replace(/(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
    }

    input.value = cpfMod;
  }

  // Validação de idade mínima

  validarIdadeMinima(): void {
    const dataNascimento = new Date(this.cadastroForm.get('dataNascimento')?.value);

    if (!dataNascimento || isNaN(dataNascimento.getTime())) {
      return;
    }

    const dataAtual = new Date();
    const diffAnos = dataAtual.getFullYear() - dataNascimento.getFullYear();

    if (diffAnos < 18) {
      this.cadastroForm.get('dataNascimento')?.setErrors({ invalidIdade: true });
      console.log('false');
    } else {
      this.cadastroForm.get('dataNascimento')?.setErrors(null);
      console.log('true');
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

  // mapeamento de elementos HTML
  @ViewChild('nomeCompleto') nomeCompleto !: ElementRef | string;
  @ViewChild('dataNascimento') dataNascimento !: ElementRef;
  @ViewChild('cpf') cpf !: ElementRef;
  @ViewChild('email') email !: ElementRef;
  @ViewChild('senha') senha !: ElementRef;
}