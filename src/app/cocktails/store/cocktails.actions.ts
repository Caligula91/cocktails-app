import { Action } from '@ngrx/store';
import { Cocktail } from '../cocktail.model';

export enum ActionType {
    SEARCH_COCKTAILS = '[Cocktails] Search Cocktails',
    SET_COCKTAILS = '[Cocktails] Set Cocktails',
    SEARCH_FAILED = '[Cocktails] Search Failed',
    START_LOAD_STORAGE = '[Cocktails] Start Load Storage',
    LOAD_STORAGE = '[Cocktails] Load Storage',
    CLEAR_RESULTS = '[Cocktails] Clear Results',
    SELECT_COCKTAIL = '[Cocktails] Select Cocktail'
}

export class SearchCocktails implements Action {
    readonly type = ActionType.SEARCH_COCKTAILS;
    constructor(public payload: string) {}
}

export class SetCocktails implements Action {
    readonly type = ActionType.SET_COCKTAILS;
    constructor(public payload: Array<Cocktail>) {}
}

export class SearchFailed implements Action {
    readonly type = ActionType.SEARCH_FAILED;
    constructor(public payload: string) {}
}

export class StartLoadStorage implements Action {
    readonly type = ActionType.START_LOAD_STORAGE;
}

export class LoadStorage implements Action {
    readonly type = ActionType.LOAD_STORAGE;
    constructor(public payload: { cocktails: Array<Cocktail>, search: string, selectedCocktail: Cocktail }) {}
}

export class ClearResults implements Action {
    readonly type = ActionType.CLEAR_RESULTS;
}

export class SelectCocktail implements Action {
    readonly type = ActionType.SELECT_COCKTAIL;
    constructor(public payload: Cocktail) {}
}

export type CocktailsActions = 
    SearchCocktails |
    SetCocktails |
    SearchFailed |
    LoadStorage |
    ClearResults |
    SelectCocktail
