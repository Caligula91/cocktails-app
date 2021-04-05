import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import * as fromApp from '../store/app.reducer';

@Injectable({
    providedIn: 'root',
})
export class AuthComponentGuard implements CanActivate {
 
    constructor(private store: Store<fromApp.AppState>, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        return this.store.select('auth').pipe(
            take(1),
            map(data => data.user),
            map(user => {
                const isLogged = !!user;
                const correctMode = route.params['mode'] === 'login' || route.params['mode'] === 'signup'
                if (!isLogged && correctMode) return true;
                return this.router.createUrlTree(['/cocktails']);
            })
        )
    }
    
}