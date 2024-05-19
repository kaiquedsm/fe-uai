import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FooterComponent } from './layouts/footer/footer.component';
import { HeaderComponent } from './layouts/header/header.component';

import { LottieComponent, LottieDirective, LottieModule } from 'ngx-lottie';

import { LoadingComponent } from './components/loading/loading.component';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { LoginCadastroComponent } from './pages/login-cadastro/login-cadastro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './pages/chat/chat.component';
import { RequestInterceptor } from './interceptors/request-interceptor';
import { ModuloComponent } from './pages/modulo/modulo.component';
import { ChatSidebarComponent } from './components/chat-sidebar/chat-sidebar.component';

import player from 'lottie-web';
import { LoadingInterceptor } from './interceptors/loading-interceptor';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    LoginCadastroComponent,
    LoadingComponent,
    ChatComponent,
    ModuloComponent,
    ChatSidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LottieModule.forRoot({player: playerFactory})
  ],
  exports: [
    LottieComponent,
    LottieDirective
  ],
  providers: [HttpClient, { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }, {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
