import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap, withLatestFrom } from "rxjs/operators";
import * as WishlistActions from './wishlist.actions';
import * as AuthActions from 'src/app/auth/store/auth.actions';
import { Store } from "@ngrx/store";
import * as fromApp from 'src/app/store/app.reducer';
import { AlertService } from "src/app/shared/alert/alert.service";
import * as ServerResponse from 'src/app/shared/server-response.model';
import { Cocktail } from "src/app/cocktails/cocktail.model";

@Injectable()
export class WishlistEffects {

    @Effect()
    fetchWishlist = this.actions$.pipe(
        ofType(WishlistActions.ActionType.FETCH_WISHLIST),
        switchMap(() => {
            const url = `https://cocktails-app-b7589-default-rtdb.firebaseio.com/users/<LOCAL_ID>/wishlist.json`
            return this.http.get<ServerResponse.WishlistResponse>(url).pipe(
                map(resData => {
                    const wishlist = new Map<number, Cocktail>();
                    if (!resData) return wishlist;
                    Object.entries(resData).forEach(([key, value]) => wishlist.set(+key, value));
                    return wishlist;
                }),
                map(wishlist => {
                    return new WishlistActions.SetWishlist(wishlist);
                }),
                catchError(error => {
                    console.log(error)
                    const errorMessage = error.error.message || error.message;
                    return of((new WishlistActions.FetchFailed(errorMessage)));
                })
            )
        })
    )

    @Effect()
    authSuccessWishlist = this.actions$.pipe(
        ofType(AuthActions.ActionType.AUTH_SUCCESS),
        map(() => new WishlistActions.FetchWishlist())
    )

    @Effect()
    updateWishlist = this.actions$.pipe(
        ofType(WishlistActions.ActionType.UPDATE_WISHLIST),
        map((data: WishlistActions.UpdateWishlist) => data.payload),
        withLatestFrom(this.store.select('wishlist')),
        switchMap(([cocktail, wishlistState]) => {
            if (wishlistState.wishlist.has(cocktail.id)) {
                this.alertService.showErrorAlert('Already in wishlist');
                return of(new WishlistActions.UpdateFailed('Already in wishlist'));
            }
            const url = `https://cocktails-app-b7589-default-rtdb.firebaseio.com/users/<LOCAL_ID>/wishlist.json`;
            return this.http.patch<ServerResponse.WishlistResponse>(url, { [cocktail.id]: cocktail }).pipe(
                map(() => {
                    this.alertService.showSuccessAlert('Added to Wishlist !');
                    return new WishlistActions.UpdateSuccess(cocktail);
                }),
                catchError(error => {
                    const errorMessage = error.error.message || error.message;
                    this.alertService.showErrorAlert('Failed to add to wishlist');
                    return of(new WishlistActions.UpdateFailed(errorMessage))
                })
            )
        })
    )

    @Effect()
    removeCocktailWishlist = this.actions$.pipe(
        ofType(WishlistActions.ActionType.REMOVE_COCKTAIL),
        map((data: WishlistActions.RemoveCocktail) => data.payload),
        switchMap(cocktail => {
            const url = `https://cocktails-app-b7589-default-rtdb.firebaseio.com/users/<LOCAL_ID>/wishlist/${cocktail.id}.json`;
            return this.http.delete<null>(url).pipe(
                map(() => {
                    this.alertService.showSuccessAlert('Removed from Wishlist !');
                    return new WishlistActions.RemoveSuccess(cocktail);
                }),
                catchError(error => {
                    const errorMessage = error.error.message || error.message;
                    this.alertService.showErrorAlert('Failed to remove from wishlist');
                    return of(new WishlistActions.UpdateFailed(errorMessage))
                })
            )
        })
    )

    @Effect()
    authLogout = this.actions$.pipe(
        ofType(AuthActions.ActionType.LOGOUT),
        map(() => new WishlistActions.ClearWishlist()),
    )

    constructor(
        private actions$: Actions, 
        private http: HttpClient, 
        private store: Store<fromApp.AppState>, 
        private alertService: AlertService) {}
}