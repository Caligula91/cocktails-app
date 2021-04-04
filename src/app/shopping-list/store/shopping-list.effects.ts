import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as ShoppingListActions from './shopping-list.actions';
import * as fromApp from 'src/app/store/app.reducer'; 
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { AlertService } from "src/app/shared/alert/alert.service";
import { of } from "rxjs";
import * as fromShoppingList from './shopping-list.reducer';
import { Ingredient } from "src/app/shared/ingredient.model";
import * as AuthActions from 'src/app/auth/store/auth.actions';

@Injectable()
export class ShoppingListEffects {

    @Effect()
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.ActionType.AUTH_SUCCESS),
        map(() => new ShoppingListActions.FetchShoppingList())
    )
    
    @Effect()
    fetchShoppingList = this.actions$.pipe(
        ofType(ShoppingListActions.ActionType.FETCH_SHOPPING_LIST),
        switchMap(() => {
            const url = `https://cocktails-app-b7589-default-rtdb.firebaseio.com/users/<LOCAL_ID>/shoppingList.json`;
            return this.http.get<Array<Ingredient>>(url).pipe(
                map(resData => {
                    resData = resData || [];
                    return new ShoppingListActions.SetIngredients(resData);
                }),
                catchError(error => {
                    const errorMessage = error.error.message || error.message;
                    this.alertService.showErrorAlert('Failed to load shopping list');
                    return of({ type: 'Dummy' });
                })
            )
        })
    )

    @Effect({ dispatch: false })
    startUpdateDatabase = this.actions$.pipe(
        ofType(ShoppingListActions.ActionType.START_UPDATE_DATABASE),
        withLatestFrom(this.store.select('shoppingList')),
        switchMap(([action, shoppingListState]) => {
            return this.handleUpdateDatabase(shoppingListState);
        })
    )

    @Effect()
    addIngredients = this.actions$.pipe(
        ofType(ShoppingListActions.ActionType.ADD_INGREDIENTS),
        withLatestFrom(this.store.select('auth')),
        map(([action, authState]) => {
            return authState.user
                ? new ShoppingListActions.StartUpdateDatabase()
                : { type: 'DUMMY' }
        })
    )

    @Effect()
    addIngredient = this.actions$.pipe(
        ofType(ShoppingListActions.ActionType.ADD_INGREDIENT),
        withLatestFrom(this.store.select('auth')),
        map(([action, authState]) => {
            return authState.user
                ? new ShoppingListActions.StartUpdateDatabase()
                : { type: 'DUMMY' }
        })
    )

    @Effect()
    updateIngredient = this.actions$.pipe(
        ofType(ShoppingListActions.ActionType.DELETE_INGREDIENT),
        withLatestFrom(this.store.select('auth')),
        map(([action, authState]) => {
            return authState.user
                ? new ShoppingListActions.StartUpdateDatabase()
                : { type: 'DUMMY' }
        })
    )

    @Effect()
    deleteIngredient = this.actions$.pipe(
        ofType(ShoppingListActions.ActionType.UPDATE_INGREDIENT),
        withLatestFrom(this.store.select('auth')),
        map(([action, authState]) => {
            return authState.user
                ? new ShoppingListActions.StartUpdateDatabase()
                : { type: 'DUMMY' }
        })
    )

    private handleUpdateDatabase(shoppingListState: fromShoppingList.State) {
        const url = `https://cocktails-app-b7589-default-rtdb.firebaseio.com/users/<LOCAL_ID>/shoppingList.json`;
        return this.http.put<any>(url, shoppingListState.ingredients).pipe(
            catchError(error => {
                if (error.status === 401) return of(null);
                const errorMessage = error.error.message || error.message;
                this.alertService.showErrorAlert('Failed to save to shopping list');
                return of(null)
            })
        )
    }

    constructor(
        private actions$: Actions, 
        private store: Store<fromApp.AppState>,
        private http: HttpClient,
        private alertService: AlertService) {}
}