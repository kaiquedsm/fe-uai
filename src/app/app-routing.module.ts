import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginCadastroComponent } from './pages/login-cadastro/login-cadastro.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ModuloComponent } from './pages/modulo/modulo.component';
import { authGuard } from './guards/auth.guard';
import { SobreNosComponent } from './pages/sobre-nos/sobre-nos.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login-cadastro', component: LoginCadastroComponent },
  { path: 'chat/necessidade/:idNecessidade', component: ChatComponent, canActivate: [authGuard] },
  { path: 'modulo', component: ModuloComponent, canActivate: [authGuard] },
  { path: 'sobre-nos', component: SobreNosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
