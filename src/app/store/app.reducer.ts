import { ActionReducerMap } from "@ngrx/store";
import * as fromCocktails from "../cocktails/store/cocktails.reducer";
import * as fromShoppingList from 'src/app/shopping-list/store/shopping-list.reducer';
import * as fromAuth from 'src/app/auth/store/auth.reducer';
import * as fromWishlist from 'src/app/wishlist/store/wishlist.reducer';

export interface AppState {
    cocktails: fromCocktails.State,
    shoppingList: fromShoppingList.State,
    auth: fromAuth.State,
    wishlist: fromWishlist.State,
}

export const appReducer: ActionReducerMap<AppState> = {
    cocktails: fromCocktails.cocktailsReducer,
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer,
    wishlist: fromWishlist.wishlistReducer,
}