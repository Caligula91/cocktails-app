import { Component, Input } from '@angular/core';
import { Cocktail } from '../cocktail.model';

@Component({
  selector: 'app-cocktail-item',
  templateUrl: './cocktail-item.component.html',
  styleUrls: ['./cocktail-item.component.css']
})
export class CocktailItemComponent {

  @Input() cocktail: Cocktail;
  @Input() id: number;

}
