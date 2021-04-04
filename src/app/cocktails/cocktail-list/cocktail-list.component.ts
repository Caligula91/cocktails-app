import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cocktail } from '../cocktail.model';
import * as fromApp from '../../store/app.reducer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cocktail-list',
  templateUrl: './cocktail-list.component.html',
  styleUrls: ['./cocktail-list.component.css']
})
export class CocktailListComponent implements OnInit, OnDestroy {

  cocktails: Array<Cocktail>;
  error: string;
  fetchingCocktails: boolean;
  storeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('cocktails').subscribe(data => {
      this.fetchingCocktails = data.fetchingCocktails;
      this.cocktails = data.cocktails;
      this.error = data.error;
    });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

}
