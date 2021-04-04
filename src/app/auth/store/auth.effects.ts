import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap, withLatestFrom } from "rxjs/operators";
import * as AuthActions from "./auth.actions";
import * as ServerResponse from "../../shared/server-response.model";
import { of } from "rxjs";
import { User } from "../user.model";
import { AuthService } from "../auth.service";
import { environment } from "src/environments/environment";
import { UserData } from "src/app/shared/local-storage.model";
import { AlertService } from "src/app/shared/alert/alert.service";
import { Store } from "@ngrx/store";
import * as fromApp from 'src/app/store/app.reducer';
import * as fromCocktails from 'src/app/cocktails/store/cocktails.reducer';

@Injectable()
export class AuthEffects {

    @Effect()
    authLogin = this.actions$
            .pipe(
                ofType(AuthActions.ActionType.LOGIN_START),
                switchMap((authData: AuthActions.LoginStart) => {
                    const { email, password } = authData.payload;
                    return this.http
                        .post<ServerResponse.LoginResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.WEB_API_KEY}`, { email, password, returnSecureToken: true })
                        .pipe(
                            tap(() => this.alertService.showSuccessAlert('Logged In !')),
                            map(resData => {
                                return this.handleAuthentication(resData);
                            }),
                            catchError(error => {
                                const errorMessage = error.error.error.message || error.message;
                                this.alertService.showErrorAlert('Failed to Login !');
                                return of((new AuthActions.AuthFailed({ error: errorMessage })));
                            })
                        )  
                })
            )

    @Effect()
    authSignup = this.actions$.pipe(
            ofType(AuthActions.ActionType.SIGNUP_START),
            switchMap((authData: AuthActions.SignupStart) => {
                const { email, password } = authData.payload;
                return this.http
                    .post<ServerResponse.SignupResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.WEB_API_KEY}`, { email, password })
                    .pipe(
                        tap(() => this.alertService.showSuccessAlert('Signed Up, Welcome !')),
                        map(resData => {
                            return this.handleAuthentication(resData);
                        }),
                        catchError(error => {
                            const errorMessage = error.error.message || error.message;
                            this.alertService.showErrorAlert('Failed to Signup !');
                            return of((new AuthActions.AuthFailed({ error: errorMessage })));
                        })
                    )
            })
        )


    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.ActionType.AUTH_SUCCESS),
        map((action: AuthActions.AuthSuccess) => action.payload.redirect),
        withLatestFrom(this.store.select('cocktails')),
        tap(([redirect, cocktailsState]) => {
            if (redirect) this.handleRedirection(cocktailsState);
        })
    )

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.ActionType.LOGOUT),
        map((action: AuthActions.Logout) => action.payload.redirect),
        withLatestFrom(this.store.select('cocktails')),
        tap(([redirect, cocktailsState]) => {
            localStorage.removeItem('userData');
            this.authService.clearAutoLogoutTimer();
            this.alertService.showSuccessAlert('Logged out !');
            if (redirect) this.handleRedirection(cocktailsState);
        })
    )

    @Effect({ dispatch: false })
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.ActionType.AUTH_SUCCESS),
        tap((userData: AuthActions.AuthSuccess) => {
            const expireTime = userData.payload.expDate.getTime() - Date.now(); 
            this.authService.autoLogoutUser(expireTime);
        }),
    )

    @Effect()
    authAutoLogin = this.actions$.pipe(
        ofType(AuthActions.ActionType.AUTO_LOGIN),
        map(() => {
            const userData: UserData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) return { type: 'DUMMY' };
            const user = new User(userData.localId, userData.email, userData._token, new Date(userData._expDate));
            if (user.token) {
                return new AuthActions.AuthSuccess(
                    { 
                        localId: userData.localId,
                        email: userData.email, 
                        token: userData._token, 
                        expDate: new Date(userData._expDate),
                        redirect: false, 
                    })
            } else {
                localStorage.removeItem('userData');
                return { type: 'DUMMY' };
            }
        })
    )

    constructor(
        private actions$: Actions, 
        private http: HttpClient, 
        private router: Router, 
        private authService: AuthService, 
        private alertService: AlertService, 
        private store: Store<fromApp.AppState>) {}

    private handleAuthentication(resData: ServerResponse.LoginResponse | ServerResponse.SignupResponse): AuthActions.AuthSuccess {
        const { localId, idToken, email, expiresIn } = resData;
        const expDate = new Date(Date.now() + (+expiresIn * 1000));
        localStorage.setItem('userData', JSON.stringify(new User(localId, email, idToken, expDate )));
        return (new AuthActions.AuthSuccess({ localId, email, token: idToken, expDate, redirect: true }));
    }

    private handleRedirection(cocktailsState: fromCocktails.State) {
        if (cocktailsState.selectedCocktail) {
            const { id, cocktailSlug } = cocktailsState.selectedCocktail;
            this.router.navigate(['/cocktails', id, cocktailSlug])
        } else {
            this.router.navigate(['/cocktails', ]);
        }     
    }

}