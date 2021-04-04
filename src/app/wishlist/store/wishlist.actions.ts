import { Action } from "@ngrx/store";
import { Cocktail } from "src/app/cocktails/cocktail.model";

export enum ActionType {
    FETCH_WISHLIST = '[Wishlist] Fetch Wishlist',
    SET_WISHLIST = '[Wishlist] Set Wishlist',
    FETCH_FAILED = '[Wishlist] Fetch Failed',
    UPDATE_WISHLIST = '[Wishlist] Update Wishlist',
    UPDATE_SUCCESS = '[Wishlist] Update Success',
    UPDATE_FAILED = '[Wishlist] Update Failed',
    CLEAR_WISHLIST = '[Wishlist] Clear Wishlist',
    REMOVE_COCKTAIL = '[Wishlist] Remove Cocktail',
    REMOVE_SUCCESS = '[Wishlist] Remove Success',
}

export class FetchWishlist implements Action {
    readonly type = ActionType.FETCH_WISHLIST;
}

export class SetWishlist implements Action {
    readonly type = ActionType.SET_WISHLIST;
    constructor(public payload: Map<number, Cocktail>) {}
}

export class FetchFailed implements Action {
    readonly type = ActionType.FETCH_FAILED;
    constructor(public payload: string) {}
}

export class UpdateWishlist implements Action {
    readonly type = ActionType.UPDATE_WISHLIST;
    constructor(public payload: Cocktail) {}
}

export class UpdateSuccess implements Action {
    readonly type = ActionType.UPDATE_SUCCESS;
    constructor(public payload: Cocktail) {}
}

export class UpdateFailed implements Action {
    readonly type = ActionType.UPDATE_FAILED;
    constructor(public payload: string) {}
}

export class ClearWishlist implements Action {
    readonly type = ActionType.CLEAR_WISHLIST;
}

export class RemoveCocktail implements Action {
    readonly type = ActionType.REMOVE_COCKTAIL;
    constructor(public payload: Cocktail) {}
}

export class RemoveSuccess implements Action {
    readonly type = ActionType.REMOVE_SUCCESS;
    constructor(public payload: Cocktail) {}
}

export type WishlistActions = 
    FetchWishlist |
    SetWishlist |
    FetchFailed |
    UpdateWishlist |
    UpdateSuccess |
    UpdateFailed |
    ClearWishlist |
    RemoveCocktail |
    RemoveSuccess