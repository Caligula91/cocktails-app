import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import * as fromApp from '../../store/app.reducer';

@Injectable({
    providedIn: 'root'
})
export class CocktailDetailsGuard implements CanActivate {

    constructor(private store: Store<fromApp.AppState>, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.store.select('cocktails').pipe(
            take(1),
            map(data => {
                return data.cocktails;
            }),
            map(cocktails => {
                const cocktail = cocktails.find(cocktail => cocktail.id === +route.params['id'])
                if (cocktail && cocktail.cocktailSlug === route.params['cocktail-slug']) return true;
                else return this.router.createUrlTree(['/', 'not-found']);
            }),
        )
    }
    
}