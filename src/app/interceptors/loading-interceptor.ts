import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map } from "rxjs";
import { LoadingService } from "../core/services/loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private loadingService: LoadingService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingService.setLoading(true, req.url);
        return next.handle(req)
            .pipe(catchError((err) => {
                this.loadingService.setLoading(false, req.url);
                return err;
            })).pipe(map((event: any) => {
                if (event instanceof HttpResponse) {
                    this.loadingService.setLoading(false, req.url);
                }
                return event;
            }));
    }

}