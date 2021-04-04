import { Cocktail } from "src/app/cocktails/cocktail.model";
import * as WishlistActions from './wishlist.actions';

export interface State {
    wishlist: Map<number, Cocktail>;
    errorFetching: string,
    errorUpdating: string,
}

const initState: State = {
    wishlist: new Map<number, Cocktail>(),
    errorFetching: null,
    errorUpdating: null,
}

export function wishlistReducer(state = initState, action: WishlistActions.WishlistActions) {
    switch(action.type) {
        case WishlistActions.ActionType.FETCH_WISHLIST: {
            return {
                ...state,
                errorFetching: null,
            }
        }
        case WishlistActions.ActionType.SET_WISHLIST: {
            return {
                ...state,
                wishlist: action.payload,
            }
        }
        case WishlistActions.ActionType.FETCH_FAILED: {
            return {
                ...state,
                errorFetching: action.payload,
            }
        }
        case WishlistActions.ActionType.UPDATE_SUCCESS: {
            return {
                ...state,
                wishlist: new Map<number, Cocktail>(state.wishlist).set(action.payload.id, action.payload),
            }
        }
        case WishlistActions.ActionType.UPDATE_WISHLIST: {
            return {
                ...state,
                errorUpdating: null,
            }
        }
        case WishlistActions.ActionType.UPDATE_FAILED: {
            return {
                ...state,
                errorUpdating: action.payload,
            }
        }
        case WishlistActions.ActionType.CLEAR_WISHLIST: {
            return {
                ...state,
                wishlist: new Map<number, Cocktail>(),
                errorFetching: null,
                errorUpdating: null,
            }
        }
        case WishlistActions.ActionType.REMOVE_COCKTAIL: {

            return {
                ...state,
                errorUpdating: null,
            }
        }
        case WishlistActions.ActionType.REMOVE_SUCCESS: {
            const newWishlist = new Map<number, Cocktail>(state.wishlist);
            newWishlist.delete(action.payload.id);
            return {
                ...state,
                wishlist: newWishlist,
            }
        }
        default: {
            return state;
        }
    }

}