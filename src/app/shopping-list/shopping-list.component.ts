import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from "./store/shopping-list.actions";
import * as fromApp from "src/app/store/app.reducer";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Array<Ingredient>;
  shoppingListSubscription: Subscription;
  selectedIngredient: number;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.shoppingListSubscription = this.store.select('shoppingList').subscribe((data) => {
      this.selectedIngredient = data.editIngredientIndex;
      this.ingredients = data.ingredients;
    });
  }

  onEditIngredient(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit({ editIngredientIndex: index }));
  }

  ngOnDestroy() {
    this.shoppingListSubscription.unsubscribe();
  }

}
