import { Ingredient } from "../shared/ingredient.model";

export class Cocktail {

    constructor(
        public id: number,
        public name: string,
        public alcoholic: string,
        public glass: string,
        public instructions: string,
        public image: string,
        public ingredients: Array<Ingredient>
    ) {}

    get cocktailSlug(): string {
        return this.name
            .trim()
            .toLowerCase()
            .replace(/\s/g, '-');
    }
}