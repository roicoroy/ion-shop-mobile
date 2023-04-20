import { Component, Input, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { AddressesActions } from 'src/app/store/addresses/addresses.actions';
import { CartActions } from 'src/app/store/cart/cart.actions';
import { IRegisterAddress } from 'projects/types/types.interfaces';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { AddressesFacade } from './cart-addresses.facade';
import { NavigationService } from 'projects/services/src/lib/services/navigation.service';
import { CustomerActions } from 'src/app/store/customer/customer.actions';

@Component({
  selector: 'app-addresses',
  templateUrl: './cart-addresses.page.html',
  styleUrls: ['./cart-addresses.page.scss'],
})
export class CartAddressesPage implements OnDestroy {

  @Input() isEdit = false;

  presentingElement: any;

  viewState$: Observable<any>;

  submitted: boolean;

  subscription = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private store: Store,
    private navigation: NavigationService,
    private readonly facade: AddressesFacade,
  ) {
    this.presentingElement = document.querySelector('#main-content');
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(
        takeUntil(this.subscription),
        take(1)
      )
      .subscribe((state) => {
        if (!state.isGuest && state?.isCustomerLoggedIn && state?.isUserLoggedIn) {
          this.store.dispatch(new CustomerActions.GetSession());
        }
      });
  }

  updateCart(vs: any) {
    if (vs.session != null) {
      this.store.dispatch(new CustomerActions.AddCustomerToCart(vs.session?.id))
    }
  }

  async useBillingAddress(address: IRegisterAddress) {
    const cartId = await this.store.selectSnapshot<any>((state: any) => state.cart?.cartId);
    this.store.dispatch(new CartActions.UpdateCartBillingAddress(cartId, address));
    this.store.dispatch(new CustomerActions.AddAShippingAddress(address));
  }
  async useShippingAddress(address: IRegisterAddress) {
    const cartId = await this.store.selectSnapshot<any>((state: any) => state.cart?.cartId);
    this.store.dispatch(new CartActions.UpdateCartShippingAddress(cartId, address));
    this.store.dispatch(new CustomerActions.AddAShippingAddress(address));
  }
  async newBillingAddress() {
    const modal = await this.modalCtrl.create({
      component: AddressDetailsComponent,
      componentProps: {
        isNewAddress: true
      }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'dismiss' && data) {
      this.useBillingAddress(data);
    }
  }
  async viewBilingAddress(address: IRegisterAddress) {
    const modal = await this.modalCtrl.create({
      component: AddressDetailsComponent,
      presentingElement: this.presentingElement,
      componentProps: {
        isNewAddress: false
      }
    });
    this.store.dispatch(new AddressesActions.AddAddressToState(address));
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'dismiss' && data) {
      this.useBillingAddress(data);
    }
  }
  async newShippingAddress() {
    const modal = await this.modalCtrl.create({
      component: AddressDetailsComponent,
      componentProps: {
        isNewAddress: true
      }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'dismiss' && data) {
      this.useShippingAddress(data);
    }
  }
  async viewShippingAddress(address?: IRegisterAddress) {
    const modal = await this.modalCtrl.create({
      component: AddressDetailsComponent,
      presentingElement: this.presentingElement,
      componentProps: {
        isNewAddress: false
      }
    });
    this.store.dispatch(new AddressesActions.AddAddressToState(address));
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'dismiss' && data) {
      this.useShippingAddress(data);
    }
  }
  async newCustomerShippingAddress() {
    const modal = await this.modalCtrl.create({
      component: AddressDetailsComponent,
      componentProps: {
        isNewAddress: true
      }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'dismiss' && data) {
      this.useCustomerShippingAddress(data);
    }
  }
  async viewCustomerShippingAddress(address?: any) {
    const modal = await this.modalCtrl.create({
      component: AddressDetailsComponent,
      presentingElement: this.presentingElement,
      componentProps: {
        isNewAddress: false
      }
    });

    this.store.dispatch(new AddressesActions.AddAddressToState(address));

    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    // console.log(data, role);
    if (role === 'dismiss' && data) {
      this.updateCustomerShippingAddress(address.id, data);
    }
  }
  async useCustomerShippingAddress(address: IRegisterAddress) {
    this.store.dispatch(new CustomerActions.AddAShippingAddress(address));
  }
  async updateCustomerShippingAddress(addressId: string, address: IRegisterAddress) {
    this.store.dispatch(new CustomerActions.UpdateCustomerAddress(addressId, address));
  }
  async deleteCustomerShippingAddress(addressId: string) {
    this.store.dispatch(new CustomerActions.DeleteCustomerAddress(addressId));
  }
  detailsPage() {
    this.navigation.navigateFlip('/shop/details');
  }
  back() {
    this.navigation.navigateFlip('/checkout/flow/start');
  }
  shipping() {
    this.navigation.navigateFlip('/checkout/flow/shipping');
  }
  ngOnDestroy() {
    this.subscription.next(null);
    this.subscription.complete();
  }
}
