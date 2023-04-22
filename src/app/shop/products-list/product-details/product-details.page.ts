import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { CustomComponentsModule } from 'src/app/components/components.module';
import { ShellModule } from 'src/app/components/shell/shell.module';
import { FormComponentsModule } from 'src/app/form-components/form-components.module';
import { NgxsModule, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CounterInputComponent } from 'src/app/components/components/counter-input/counter-input.component';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { clearSelectedProduct } from 'src/app/store/products/products.actions';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { ShopFacade } from '../../shop.facade';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    FormComponentsModule,
    CustomComponentsModule,
    ShellModule
  ]
})
export class ProductDetailsPage implements OnInit {

  @ViewChild('counterInput') counterInput: CounterInputComponent;

  viewState$: Observable<any>;

  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    }
  };
  productOptions: any = [];
  optionsVariants: any = [];
  productVariants: any = [];
  selectedOptionId: string;
  selectedVariantId: string;

  constructor(
    private store: Store,
    private navigation: NavigationService,
    private facade: ShopFacade,
    public alertController: AlertController,
  ) {
    this.viewState$ = this.facade.viewState$;
    this.viewState$.subscribe((vs) => {
      console.log(vs);
    });
  }
  ngOnInit() {
  }
  onSelectChange(option: any) {
    this.selectedOptionId = option.id;
    this.optionsVariants = [];
    this.selectedVariantId = '';
    this.optionsVariants = option;
  }
  onSelectOption(option: any) {
    console.log(option.variant_id);
    this.selectedVariantId = option.variant_id;
  }
  onSelectVariant(variantId: any) {
    this.selectedVariantId = variantId.variant_id;
  }
  addToCart() {
    if (this.selectedVariantId && this.counterInput?.counterValue > 0) {
      this.facade.addToMedusaCart(this.selectedVariantId, this.counterInput?.counterValue);
    }
  }
  navigateBack() {
    this.optionsVariants = [];
    this.navigation.navigateFlip('products-list');
    this.store.dispatch(new clearSelectedProduct());
  }

}
