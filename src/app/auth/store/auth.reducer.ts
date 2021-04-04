import * as AuthActions from "./auth.actions";

import { User } from "../user.model";


export interface State {
    user: User,
    isLoading: boolean,
    error: string,
    redirect: boolean,
}

const initState: State = {
    user: null,
    isLoading: false,
    error: null,
    redirect: false,
}

export function authReducer(state = initState, action: AuthActions.AuthActions) {
    switch(action.type) {
        
        case AuthActions.ActionType.LOGIN_START: {
            return {
                ...state,
                isLoading: true,
                error: null,             
            }
        }
        case AuthActions.ActionType.SIGNUP_START: {
            return {
                ...state,
                isLoading: true,
                error: null,
            }
        }
        case AuthActions.ActionType.AUTH_SUCCESS: {
            const { localId, email,  token, expDate, redirect } = action.payload;
            const user = new User(localId, email, token, expDate);
            return {
                ...state,
                user,
                redirect,
                isLoading: false,
            }
        }
        case AuthActions.ActionType.LOGOUT: {
            return {
                ...state,
                user: null,
                isLoading: false,
                error: null,
            }
        }
        case AuthActions.ActionType.AUTH_FAILED: {
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
            }
        }
        case AuthActions.ActionType.CLEAR_ERROR: {
            return {
                ...state,
                error: null,
            }
        }
        default: {
            return state;
        }
    }
}