import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CocktailDetailsComponent } from './cocktails/cocktail-details/cocktail-details.component';
import { CocktailsComponent } from './cocktails/cocktails.component';
import { CocktailDetailsGuard } from './cocktails/cocktail-details/cocktail-details-guard.service';
import { CocktailDetailsResolver } from './cocktails/cocktail-details/cocktail-details-resolver.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthComponentGuard } from './auth/auth-component-guard.service';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'cocktails', component: CocktailsComponent, children: [
    { path: ':id/:cocktail-slug', canActivate: [CocktailDetailsGuard], resolve: { cocktail: CocktailDetailsResolver }, component: CocktailDetailsComponent }
  ] },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'auth/:mode', canActivate:[AuthComponentGuard], component: AuthComponent },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'not-found', component: ErrorPageComponent },
  { path: '**', redirectTo: 'not-found' }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
