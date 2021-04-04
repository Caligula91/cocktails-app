import { Action } from "@ngrx/store";

export enum ActionType {
    LOGIN_START = '[Auth] Login Start',
    SIGNUP_START = '[Auth]  Signup Start',
    AUTH_SUCCESS = '[Auth] Auth Success',
    AUTH_FAILED = '[Auth] Auth Failed',
    LOGOUT = '[Auth] Logout',
    CLEAR_ERROR = '[Auth] Clear Error',
    AUTO_LOGIN = "[Auth] Auto Login"
}

export class LoginStart implements Action {
    readonly type = ActionType.LOGIN_START;
    constructor(public payload: { email: string, password: number }) {}
}

export class SignupStart implements Action {
    readonly type = ActionType.SIGNUP_START;
    constructor(public payload: { email: string, password: string }) {}
}

export class AuthFailed implements Action {
    readonly type = ActionType.AUTH_FAILED;
    constructor(public payload: { error: string }) {}
}

export class Logout implements Action {
    readonly type = ActionType.LOGOUT;
    constructor(public payload: { redirect: boolean }) {}
}

export class AuthSuccess implements Action {
    readonly type = ActionType.AUTH_SUCCESS;
    constructor(public payload: { localId: string, email: string, token: string, expDate: Date, redirect: boolean }) {}
}

export class ClearError implements Action {
    readonly type = ActionType.CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type = ActionType.AUTO_LOGIN;
}

export type AuthActions =
    Logout |
    LoginStart |
    SignupStart |
    AuthFailed |
    AuthSuccess |
    ClearError |
    AutoLogin;