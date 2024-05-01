import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginCadastroComponent } from './pages/login-cadastro/login-cadastro.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ModuloComponent } from './pages/modulo/modulo.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login-cadastro', component: LoginCadastroComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'modulo', component: ModuloComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
