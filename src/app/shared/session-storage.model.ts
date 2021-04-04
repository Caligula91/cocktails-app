import { Cocktail } from "../cocktails/cocktail.model";

export default interface SessionStorage {
    cocktails: Array<Cocktail>,
    search: string,
    selectedCocktail: Cocktail,
}