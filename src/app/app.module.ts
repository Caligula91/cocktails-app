import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CocktailsComponent } from './cocktails/cocktails.component';
import { CocktailItemComponent } from './cocktails/cocktail-item/cocktail-item.component';
import { CocktailListComponent } from './cocktails/cocktail-list/cocktail-list.component';
import { CocktailSearchComponent } from './cocktails/cocktail-search/cocktail-search.component';
import { CocktailDetailsComponent } from './cocktails/cocktail-details/cocktail-details.component';
import * as fromApp from './store/app.reducer';
import { CocktailsEffects } from './cocktails/store/cocktails.effects';
import { environment } from 'src/environments/environment';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { AlertComponent } from './shared/alert/alert.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthComponent } from './auth/auth.component';
import { AuthEffects } from './auth/store/auth.effects';
import { WishlistComponent } from './wishlist/wishlist.component';
import { WishlistEffects } from './wishlist/store/wishlist.effects';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ShoppingListEffects } from './shopping-list/store/shopping-list.effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CocktailsComponent,
    CocktailItemComponent,
    CocktailListComponent,
    CocktailSearchComponent,
    CocktailDetailsComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    ErrorPageComponent,
    HomeComponent,
    AlertComponent,
    LoadingSpinnerComponent,
    AuthComponent,
    WishlistComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([CocktailsEffects, AuthEffects, WishlistEffects, ShoppingListEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
