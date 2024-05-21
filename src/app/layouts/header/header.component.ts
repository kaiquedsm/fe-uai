import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedIn: boolean = false;

  constructor(private router: Router, private userService: UserService) { }

  loginCadastro() {
    if(this.loggedIn) {
      this.userService.logout();
      this.router.navigate(['/']);
      this.loggedIn = false;
    } else {
      this.router.navigate(['/login-cadastro']);
    }
  }

  ngOnInit(): void {
    const token = this.userService.dadosLogin?.value?.body?.token;
    if(token) {
      this.loggedIn = true;
    }
  }

  faBars = faBars

}
