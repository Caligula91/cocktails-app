import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from "../../store/app.reducer";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f') shoppingForm: NgForm;
  shoppingListSubscription: Subscription;
  editMode: boolean = false;
  editIndex: number;
  editIngredient: Ingredient;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.shoppingListSubscription = this.store.select('shoppingList').subscribe(data => {
      if (data.editIngredient) {
        this.editMode = true;
        this.editIndex = data.editIngredientIndex;
        this.editIngredient = data.editIngredient;
        this.shoppingForm.form.patchValue({
          'name': this.editIngredient.name,
          'amount': this.editIngredient.amount,
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    const { name, amount } = form.value;
    const ingredient = new Ingredient(name, amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient({ ingredient }));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }
    form.reset();
  }

  ngOnDestroy() {
    this.store.dispatch(new ShoppingListActions.EndEdit());
    this.shoppingListSubscription.unsubscribe();
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.shoppingForm.reset();
  }

  onClear() {
    this.store.dispatch(new ShoppingListActions.EndEdit());
    this.shoppingForm.reset();
  }

}
