import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: boolean = false;
  storeSub: Subscription;
  userSub: Subscription;
  wishlistSub: Subscription;
  route: string = '/cocktails';
  wishlistSum: number = 0;
  email: string;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.userSub.unsubscribe();
    this.wishlistSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth').subscribe(data => {
      if (data.user) {
        this.user = true;
        this.email = data.user.email;
      } else {
        this.user = false;
        this.email = null;
      }
    });
    this.storeSub = this.store.select('cocktails').pipe(
      map(data => {
        return `/cocktails/${data.selectedCocktail?data.selectedCocktail.id+'/'+data.selectedCocktail.cocktailSlug:''}`;
      })
    ).subscribe(route => {
      this.route = route;
    })
    this.wishlistSub = this.store.select('wishlist').subscribe(data => {
      this.wishlistSum = data.wishlist.size;
    })
  }

  onLogout(): void {
    this.store.dispatch(new AuthActions.Logout({ redirect: false }));
  }

}
