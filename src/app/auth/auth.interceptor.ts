import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import * as fromApp from "../store/app.reducer";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private store: Store<fromApp.AppState>) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith('https://cocktails-app-b7589-default-rtdb.firebaseio.com/users/')) {
      return this.store.select('auth')
        .pipe(
          take(1),
          map(data => data.user),
          exhaustMap(user => {
            if (user) {
              const modifiedReq = request.clone({ 
                params: request.params.append('auth', user.token),
                url: request.url.replace('<LOCAL_ID>', user.localId)});
              return next.handle(modifiedReq);
            }
            return next.handle(request);
          })
        )
    } 
    return next.handle(request);
  }
}
