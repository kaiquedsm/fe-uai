import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fe-uai';

  constructor(private router: Router) { }

  isValidUrl(): boolean {
    let currentUrl = this.router.url;
    return currentUrl !== '/login-cadastro';
  }
}
