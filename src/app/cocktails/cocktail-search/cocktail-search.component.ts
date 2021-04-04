import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as CocktailsActions from '../store/cocktails.actions';
import * as fromApp from '../../store/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cocktail-search',
  templateUrl: './cocktail-search.component.html',
  styleUrls: ['./cocktail-search.component.css']
})
export class CocktailSearchComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;
  storeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      'search': new FormControl(null, Validators.required),
    });
    this.storeSub = this.store.select('cocktails')
      .subscribe(data => {
        this.searchForm.setValue({
          search: data.search,
        })
      });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

  onSubmit(): void {
    // redirect to cocktails
    // perform search
    this.router.navigate(['/', 'cocktails']);
    const search = this.searchForm.get('search').value;
    this.store.dispatch(new CocktailsActions.SearchCocktails(search));
  }

  onClear(): void {
    this.router.navigate(['/', 'cocktails']);
    this.store.dispatch(new CocktailsActions.ClearResults());
  }

}
