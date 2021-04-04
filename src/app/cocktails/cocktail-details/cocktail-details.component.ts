import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { Cocktail } from '../cocktail.model';
import * as ShoppingListActions from 'src/app/shopping-list/store/shopping-list.actions';
import { AlertService } from 'src/app/shared/alert/alert.service';
import * as WishlistActions from 'src/app/wishlist/store/wishlist.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cocktail-details',
  templateUrl: './cocktail-details.component.html',
  styleUrls: ['./cocktail-details.component.css']
})
export class CocktailDetailsComponent implements OnInit, OnDestroy {

  storeSub: Subscription;
  wishSub: Subscription;
  authSub: Subscription;
  @Input() cocktail: Cocktail;
  wishlist: Map<number, Cocktail>;
  isLogged: boolean;
  @Input() wishlistMode: boolean = false;

  constructor(private store: Store<fromApp.AppState>, private alertService: AlertService) { }

  ngOnInit(): void {
    if (!this.wishlistMode) {
      this.storeSub = this.store.select('cocktails').subscribe(data => {
        this.cocktail = data.selectedCocktail;
      });
    }
    this.wishSub = this.store.select('wishlist').subscribe(data => {
      this.wishlist = data.wishlist;
    });
    this.authSub = this.store.select('auth').pipe(
      map(data => data.user),
    ).subscribe(user => this.isLogged = !!user);
  }

  ngOnDestroy(): void {
    if (!this.wishlistMode) this.storeSub.unsubscribe();
    this.authSub.unsubscribe();
    this.wishSub.unsubscribe();
  }

  onAddToShoppingList(): void {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.cocktail.ingredients));
    this.alertService.showSuccessAlert('Ingredients Added To Shopping List');
  }

  onLikeCocktail(): void {
    if (this.wishlist.has(this.cocktail.id)) {
      this.store.dispatch(new WishlistActions.RemoveCocktail(this.cocktail));
    } else {
      this.store.dispatch(new WishlistActions.UpdateWishlist(this.cocktail));
    }
  }

}
