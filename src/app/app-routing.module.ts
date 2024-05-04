import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginCadastroComponent } from './pages/login-cadastro/login-cadastro.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login-cadastro', component: LoginCadastroComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
