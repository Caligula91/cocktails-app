import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import * as fromApp from '../../store/app.reducer';
import * as CocktailsActions from '../store/cocktails.actions';

@Injectable({
    providedIn: 'root'
})
export class CocktailDetailsResolver implements Resolve<null> {

    constructor(private store: Store<fromApp.AppState>) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): null | Observable<null> | Promise<null> {
        return this.store.select('cocktails').pipe(
            take(1),
            map(data => data.cocktails.find(value => value.id === +route.params['id'])),
            tap(cocktail => {
                this.store.dispatch(new CocktailsActions.SelectCocktail(cocktail))
            }),
            exhaustMap(() => of(null))
        )
    }
    
}