import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Cocktail } from '../cocktails/cocktail.model';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit, OnDestroy {

  wishSub: Subscription;
  authSub: Subscription;
  wishlist: Array<Cocktail>;

  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnInit(): void {
    this.wishSub = this.store.select('wishlist').subscribe(data => {
      this.wishlist = Array.from(data.wishlist.values());
    });
    this.authSub = this.store.select('auth').pipe(
      map(data => !!data.user),
      withLatestFrom(this.store.select('cocktails')),
    ).subscribe(([isLogged, cocktailsState]) => {
      if (!isLogged) {
        if (cocktailsState.selectedCocktail) {
            const { id, cocktailSlug } = cocktailsState.selectedCocktail;
            this.router.navigate(['/cocktails', id, cocktailSlug])
        } else {
            this.router.navigate(['/cocktails', ]);
        } 
      }
    })
  }
  
  ngOnDestroy(): void {
    this.wishSub.unsubscribe();
    this.authSub.unsubscribe();
  }

}
