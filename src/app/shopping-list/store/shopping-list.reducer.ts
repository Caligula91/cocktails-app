import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface State {
    ingredients: Array<Ingredient>;
    editIngredient: Ingredient,
    editIngredientIndex: number,
}

const initState: State = {
    ingredients: [],
    editIngredient: null,
    editIngredientIndex: -1,
}



export function shoppingListReducer (state = initState, action: ShoppingListActions.ShoppingListActions) {
    switch(action.type) {
        case ShoppingListActions.ActionType.ADD_INGREDIENT: {
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload],
            }
        }
        case ShoppingListActions.ActionType.ADD_INGREDIENTS: {
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            }
        }
        case ShoppingListActions.ActionType.SET_INGREDIENTS: {
            return {
                ...state,
                ingredients: action.payload,
            }
        }
        case ShoppingListActions.ActionType.UPDATE_INGREDIENT: {
            return {
                ...state,
                ingredients: state.ingredients
                    .map((ingredient, index) => (index === state.editIngredientIndex) ? action.payload.ingredient : ingredient),
                editIngredientIndex: -1,
                editIngredient: null,
            }
        }
        case ShoppingListActions.ActionType.DELETE_INGREDIENT: {
            return {
                ...state,
                ingredients: state.ingredients.filter((value, index) => index !== state.editIngredientIndex),
                editIngredientIndex: -1,
                editIngredient: null,
            }
        }

        case ShoppingListActions.ActionType.START_EDIT: {
            return {
                ...state,
                editIngredientIndex: action.payload.editIngredientIndex,
                editIngredient: { ...state.ingredients[action.payload.editIngredientIndex] },
            }
        }
        case ShoppingListActions.ActionType.END_EDIT: {
            return {
                ...state,
                editIngredientIndex: -1,
                editIngredient: null,
            }
        }
        default: {
            return state;
        }
    }
}