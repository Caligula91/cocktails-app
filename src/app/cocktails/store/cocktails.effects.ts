import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { environment } from 'src/environments/environment';
import { Cocktail } from '../cocktail.model';
import * as CocktailsActions from './cocktails.actions';
import * as ServerResponse from '../../shared/server-response.model';
import SessionStorage from "src/app/shared/session-storage.model";
import * as fromApp from 'src/app/store/app.reducer';

@Injectable()
export class CocktailsEffects {

    @Effect()
    searchCocktails = this.actions$.pipe(
        ofType(CocktailsActions.ActionType.SEARCH_COCKTAILS),
        switchMap((data: CocktailsActions.SearchCocktails) => {
            const search = data.payload;
            return this.http
                .get<ServerResponse.SearchCocktailsResponse>(`https://www.thecocktaildb.com/api/json/v1/${environment.API_KEY}/search.php?s=${search}`)
                .pipe(
                    map(resData => {
                        if (!resData.drinks) {
                            sessionStorage.setItem('cocktailsData', JSON.stringify({ search, cocktails: [] }));
                            return new CocktailsActions.SetCocktails([]);
                        } 
                        const cocktails = resData.drinks.map(cocktail => {
                            const { idDrink, strDrink, strAlcoholic, strGlass, strInstructions, strDrinkThumb } = cocktail;
                            const ingredients: Array<Ingredient> = [];
                            let i = 1;
                            while (cocktail[`strIngredient${i}`]) {
                                const ingredient = new Ingredient(
                                    cocktail[`strIngredient${i}`],
                                    cocktail[`strMeasure${i}`]
                                );
                                ingredients.push(ingredient);
                                ++i;
                            }
                            return new Cocktail(+idDrink, strDrink, strAlcoholic, strGlass, strInstructions, strDrinkThumb, ingredients)
                        })
                        sessionStorage.setItem('cocktailsData', JSON.stringify({ search, cocktails }));
                        return new CocktailsActions.SetCocktails(cocktails);
                    }),
                    catchError(error => {
                        console.log(error)
                        const errorMessage = error.error.message || error.message || 'Unknown error'
                        return of(new CocktailsActions.SearchFailed(errorMessage));
                    })
                )
        })
    )

    @Effect({ dispatch: false })
    clearResults = this.actions$.pipe(
        ofType(CocktailsActions.ActionType.CLEAR_RESULTS),
        tap(() => sessionStorage.removeItem('cocktailsData')),
    )

    @Effect({ dispatch: false })
    updateSessionStorage = this.actions$.pipe(
        ofType(CocktailsActions.ActionType.SELECT_COCKTAIL),
        tap((data: CocktailsActions.SelectCocktail) => {
            const obj = JSON.parse(sessionStorage.getItem('cocktailsData'));
            obj.selectedCocktail = data.payload;
            sessionStorage.setItem('cocktailsData', JSON.stringify(obj));
        })
    )

    @Effect()
    loadStorage = this.actions$.pipe(
        ofType(CocktailsActions.ActionType.START_LOAD_STORAGE),
        map(() => {
            const cocktailsData: SessionStorage = JSON.parse(sessionStorage.getItem('cocktailsData'));
            if (cocktailsData) {
                return new CocktailsActions.LoadStorage({
                    cocktails: cocktailsData.cocktails,
                    search: cocktailsData.search,
                    selectedCocktail: cocktailsData.selectedCocktail, 
                })
            } else {
                return { type: 'DUMMY' }
            }
        })
    )

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}