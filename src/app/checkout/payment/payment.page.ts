import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { Observable, Subject } from 'rxjs';
import { CustomComponentsModule } from 'src/app/components/components.module';
import { IPaymentFacadeState, PaymentFacade } from './payment.facade';
import { NgxStripeModule, StripePaymentElementComponent, StripeService } from 'ngx-stripe';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { UtilityService } from 'src/app/shared/services/utility/utility.service';
import { AddressesActions } from 'src/app/store/addresses/addresses.actions';
import { CartActions } from 'src/app/store/cart/cart.actions';
import { MedusaActions } from 'src/app/store/medusa/medusa.actions';

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.page.html',
  styleUrls: ['payment.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    CustomComponentsModule,
    NgxStripeModule
  ],
})
export class PaymentPage implements OnDestroy {

  @ViewChild(StripePaymentElementComponent)

  private navigation = inject(NavigationService);

  private facade = inject(PaymentFacade);
  
  private store = inject(Store);
  
  private utility = inject(UtilityService);
  
  private stripeService = inject(StripeService);

  private readonly ngUnsubscribe = new Subject();

  paymentElement: StripePaymentElementComponent;

  elementsOptions: StripeElementsOptions;

  viewState$: Observable<IPaymentFacadeState>;

  constructor() {
    this.viewState$ = this.facade.viewState$;
    this.viewState$.subscribe((vs) => {
      console.log(vs);
    });
  }
  loginPages() {
    this.navigation.navControllerDefault('/auth/pages/auth-home');
  }
  cartAddresses() {
    this.navigation.navControllerDefault('/checkout/pages/cart-addresses');
  }
  cartReviewPage() {
    this.navigation.navControllerDefault('/checkout/pages/cart-review');
  }
  orderReviewPage() {
    this.navigation.navControllerDefault('/checkout/pages/order-review');
  }
  shippingPage() {
    this.navigation.navControllerDefault('/checkout/pages/shipping');
  }
  logout() {
  }
  async confirm() {
    this.utility.presentLoading('...');
    return this.stripeService.confirmPayment({
      elements: this.paymentElement.elements,
      redirect: 'if_required'
    }).subscribe(async (result: any) => {
      if (result.error) {
        this.utility.dismissLoading();
        this.utility.showToast(result.error?.message, 'middle', 1500);
      }
      if (!result.error) {
        const cartId = await this.store.selectSnapshot<any>((state: any) => state.cart.cart?.id);

        this.store.dispatch(new CartActions.CompleteCart(cartId));
        this.store.dispatch(new MedusaActions.LogOut());
        this.store.dispatch(new CartActions.LogOut());
        this.store.dispatch(new AddressesActions.LogOut());
        this.store.dispatch(new MedusaActions.UnSetSecretKey());
        this.store.dispatch(new CartActions.ClearIsGuest());

        this.utility.dismissLoading().then(() => this.navigateToReview());

      }
    });
  }
  navigateToReview() {
    this.navigation.navigateFlip('/checkout/flow/order-review');
  }
  back() {
    this.navigation.navigateFlip('checkout/flow/shipping');
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
