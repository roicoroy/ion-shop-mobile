import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { VariantFacade } from './variant.facade';
import { CounterInputComponent } from 'src/app/components/components/counter-input/counter-input.component';
import { Observable } from 'rxjs';
import { CartActions } from 'src/app/store/cart/cart.actions';
import { Store } from '@ngxs/store';
import { CustomComponentsModule } from 'projects/components/src/public-api';

@Component({
  selector: 'app-variant-modal',
  templateUrl: './variant-modal.page.html',
  styleUrls: ['./variant-modal.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CustomComponentsModule
  ]
})
export class VariantModalPage implements OnInit {

  private modalCtrl = inject(ModalController);
  private store = inject(Store);
  private facade = inject(VariantFacade);

  @ViewChild('counterInput') counterInput: CounterInputComponent;

  @Input() variant: any;

  viewState$: Observable<any>;

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
  }
  addToCart() {
    const cartId = this.store.selectSnapshot<any>((state) => state.cart?.cartId);
    if (cartId != null && this.variant != null) {
      this.store.dispatch(new CartActions.AddProductMedusaToCart(cartId, this.counterInput.counterValue, this.variant?.id));
      this.dismiss();
    } else {
      this.store.dispatch(new CartActions.CreateMedusaCart()).subscribe((state) => {
        this.store.dispatch(new CartActions.AddProductMedusaToCart(state.cart?.cartId, this.counterInput.counterValue, this.variant?.id));
        this.dismiss();
      });
    }
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }
}
