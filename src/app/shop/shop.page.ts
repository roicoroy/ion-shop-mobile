import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { GetProductList } from '../store/products/products.actions';

@Component({
  selector: 'app-shop',
  templateUrl: 'shop.page.html',
  styleUrls: ['shop.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
  ],
})
export class ShopPage {
  
  public environmentInjector = inject(EnvironmentInjector);
  
  private store = inject(Store);

  constructor() {
    this.store.dispatch(new GetProductList());
  }
}
