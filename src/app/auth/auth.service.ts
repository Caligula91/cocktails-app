import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

// provide in auth only
@Injectable({
    providedIn: 'root',
})
export class AuthService {

    tokenExpTimer: any;

    constructor(private store: Store<fromApp.AppState>) {}

    // 2147483647 max value for setTimeout()
    autoLogoutUser(expDuration: number) {
        if (expDuration > 2147483647) {
            this.tokenExpTimer = setTimeout(() => {
                console.log('set timeout expired in if');
                this.autoLogoutUser(expDuration - 2147483647);
            }, 2147483647)
        } else {
            this.tokenExpTimer = setTimeout(() => {
                console.log('set timeout expired in else')
                this.store.dispatch(new AuthActions.Logout({ redirect: true }));
            }, expDuration)
        }
    }

    clearAutoLogoutTimer() {
        if (this.tokenExpTimer) {
            clearTimeout(this.tokenExpTimer);
            this.tokenExpTimer = null;   
        }
    }
}