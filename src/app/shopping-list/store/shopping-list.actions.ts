import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export enum ActionType {
    ADD_INGREDIENT = 'ADD_INGREDIENT',
    ADD_INGREDIENTS = 'ADD_INGREDIENTS',
    UPDATE_INGREDIENT = 'UPDATE_INGREDIENT',
    DELETE_INGREDIENT = 'DELETE_INGREDIENT',
    START_EDIT = 'START_EDIT',       
    END_EDIT = 'END_EDIT',
    FETCH_SHOPPING_LIST = '[ShoppingList] Fetch Shopping List',
    SET_INGREDIENTS = '[ShoppingList] Set Ingredients',
    START_UPDATE_DATABASE = '[ShoppingList] Start Update Database',
}

export class AddIngredient implements Action {
    readonly type = ActionType.ADD_INGREDIENT;
    constructor(public payload: Ingredient) {}

}

export class AddIngredients implements Action {
    readonly type = ActionType.ADD_INGREDIENTS;
    constructor(public payload: Ingredient[]) {}
    
}

export class UpdateIngredient implements Action {
    readonly type = ActionType.UPDATE_INGREDIENT;
    constructor(public payload: { ingredient: Ingredient }) {}
}

export class DeleteIngredient implements Action {
    readonly type = ActionType.DELETE_INGREDIENT;
    constructor() {}
}

export class StartEdit implements Action {
    readonly type = ActionType.START_EDIT;
    constructor(public payload: { editIngredientIndex: number }) {}
}

export class EndEdit implements Action {
    readonly type = ActionType.END_EDIT;
}

export class FetchShoppingList implements Action {
    readonly type = ActionType.FETCH_SHOPPING_LIST;
}

export class SetIngredients implements Action {
    readonly type = ActionType.SET_INGREDIENTS;
    constructor(public payload: Array<Ingredient>) {}
}

export class StartUpdateDatabase implements Action {
    readonly type = ActionType.START_UPDATE_DATABASE;
}

export type ShoppingListActions = 
    AddIngredient | 
    AddIngredients |
    UpdateIngredient |
    DeleteIngredient |
    StartEdit |
    EndEdit |
    FetchShoppingList |
    SetIngredients |
    StartUpdateDatabase;