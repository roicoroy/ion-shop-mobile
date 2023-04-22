import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { addSelectedVariant, addSelectedProduct, clearSelectedProduct, GetProductList } from 'src/app/store/products/products.actions';
import { VariantModalPage } from './variant-modal/variant-modal.page';
import { CustomComponentsModule } from 'src/app/components/components.module';
import { IShopFacadeState, ShopFacade } from '../shop.facade';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.page.html',
  styleUrls: ['./products-list.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    CustomComponentsModule,
    VariantModalPage
  ]
})
export class ProductsListPage implements OnInit {

  private facade = inject(ShopFacade);
  private navigation = inject(NavigationService);
  private modalCtrl = inject(ModalController);
  private store = inject(Store);

  viewState$: Observable<IShopFacadeState>;

  ngOnInit() {
    this.viewState$ = this.facade.viewState$
    // this.viewState$.subscribe((vs) => {
    //   console.log(vs);
    // });
    this.store.dispatch(new GetProductList());
  }
  async selectVariant(variant: any) {
    this.store.dispatch(new addSelectedVariant(variant));
    const modal = await this.modalCtrl.create({
      component: VariantModalPage,
      componentProps: {
        variant: variant
      },
      cssClass: 'dialog-modal'
    });
    await modal.present();
  }
  navigateDetails(product: any) {
    this.navigation.navControllerDefault('/product-details');
    this.store.dispatch(new addSelectedProduct(product));
  }
  navigateHome() {
    this.store.dispatch(new clearSelectedProduct());
    this.navigation.navigateFlip('/home');
  }
}
