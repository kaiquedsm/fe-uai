import { Injectable } from "@angular/core";
import { UserService } from "./user.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(private userService: UserService) {

    }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.userService.dadosLogin.getValue()?.body?.token;
        if(req.url.includes('casual') || req.url.includes('auth')) {
            return next.handle(req);
        }
        if(token) {
            return next.handle(req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            }));
        }
        return next.handle(req);
    }

}