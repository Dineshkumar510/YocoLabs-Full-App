import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const UserToken = localStorage.getItem("UserSessionToken");
    if(UserToken){
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${UserToken}`, //header format
        }
        });
        return next.handle(clonedRequest);
    } else {
      return next.handle(req);
    }
  }
}
