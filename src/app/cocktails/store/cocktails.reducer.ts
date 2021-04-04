import { Cocktail } from '../cocktail.model';
import * as CocktailsActions from './cocktails.actions';

export interface State {
    cocktails: Array<Cocktail>,
    fetchingCocktails: boolean,
    search: string,
    page: number,
    error: string,
    selectedCocktail: Cocktail,
}

const initState: State = {
    cocktails: [],
    fetchingCocktails: false,
    error: null,
    search: null,
    page: 0,
    selectedCocktail: null,
}

export function cocktailsReducer(state = initState, action: CocktailsActions.CocktailsActions) {
    switch(action.type) {
        case CocktailsActions.ActionType.SEARCH_COCKTAILS: {
            return {
                ...state,
                fetchingCocktails: true,
                cocktails: [],
                selectedCocktail: null,
                error: null,
                search: action.payload,
            }
        }
        case CocktailsActions.ActionType.SET_COCKTAILS: {
            return  {
                ...state,
                fetchingCocktails: false,
                cocktails: action.payload,
                selectedCocktail: null,
            }
        }
        case CocktailsActions.ActionType.SEARCH_FAILED: {
            return {
                ...state,
                fetchingCocktails: false,
                error: action.payload,
            }
        }
        case CocktailsActions.ActionType.LOAD_STORAGE: {
            let selectedCocktail: Cocktail = null;
            if (action.payload.selectedCocktail) {
                const { id, name, alcoholic, glass, instructions, image, ingredients } = action.payload.selectedCocktail;
                selectedCocktail = new Cocktail(id, name, alcoholic, glass, instructions, image, ingredients);
            }
            return {
                ...state,
                cocktails: action.payload.cocktails.map(cocktail => 
                    new Cocktail(
                        cocktail.id, cocktail.name, cocktail.alcoholic, cocktail.glass, cocktail.instructions, cocktail.image, cocktail.ingredients)),
                selectedCocktail,
                search: action.payload.search,
            }
        }
        case CocktailsActions.ActionType.CLEAR_RESULTS: {
            return {
                ...state,
                cocktails: [],
                search: null,
                selectedCocktail: null,
            }
        }
        case CocktailsActions.ActionType.SELECT_COCKTAIL: {
            return {
                ...state,
                selectedCocktail: action.payload,
            }
        }
        default: {
            return state;
        }
    }
}