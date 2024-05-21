import { Injectable } from "@angular/core";
import { UserService } from "../core/services/user.service";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(private userService: UserService, private router: Router) {

    }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.userService.dadosLogin.getValue()?.body?.token;
        if(req.url.includes('casual') || req.url.includes('auth')) {
            return next.handle(req);
        }
        if(token) {
            return next.handle(req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            })).pipe(catchError((error: any) => {
                if(error.status === 401) {
                    this.userService.logout();
                    this.router.navigate(['/login-cadastro']);
                    return next.handle(req);
                } 
                return next.handle(req);
            }));
        }
        return next.handle(req);
    }

}