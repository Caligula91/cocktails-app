import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import * as fromApp from '../store/app.reducer';

@Injectable({
    providedIn: 'root',
})
export class AuthComponentGuard implements CanActivate {
 
    constructor(private store: Store<fromApp.AppState>) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        return this.store.select('auth').pipe(
            take(1),
            map(data => data.user),
            map(user => {
                return !user && (route.params['mode'] === 'login' || route.params['mode'] === 'signup')
            })
        )
    }
    
}