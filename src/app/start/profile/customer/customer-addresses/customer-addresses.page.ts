import { Component, Input, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CustomerAddressDetailsComponent } from './customer-address-details/customer-address-details.component';
import { CutomerAddressDetailsFacade } from './customer-addresses.facade';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { CustomerActions } from 'src/app/store/customer/customer.actions';
import { AddressesActions } from 'src/app/store/addresses/addresses.actions';
import { IRegisterAddress } from 'src/app/shared/types/types.interfaces';

@Component({
  selector: 'app-customer-addresses',
  templateUrl: './customer-addresses.page.html',
  styleUrls: ['./customer-addresses.page.scss'],
})
export class CustomerAddressesPage implements OnDestroy {

  @Input() isEdit = false;
  presentingElement: any;
  viewState$: Observable<any>;
  submitted: boolean;
  subscription = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private store: Store,
    private navigation: NavigationService,
    private readonly facade: CutomerAddressDetailsFacade,
  ) {
    this.presentingElement = document.querySelector('#main-content');
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(
        takeUntil(this.subscription),
        // take(1)
      )
      .subscribe((state) => {
        console.log(state);
      });
  }
  async useBillingAddress(address: IRegisterAddress) {
    const cartId = await this.store.selectSnapshot<any>((state: any) => state.cart?.cartId);
    // this.store.dispatch(new CartActions.UpdateCartBillingAddress(cartId, address));
  }
  async useShippingAddress(address: IRegisterAddress) {
    const cartId = await this.store.selectSnapshot<any>((state: any) => state.cart?.cartId);
    // this.store.dispatch(new CartActions.UpdateCartShippingAddress(cartId, address));
  }
  async newCustomerShippingAddress() {
    const modal = await this.modalCtrl.create({
      component: CustomerAddressDetailsComponent,
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
      component: CustomerAddressDetailsComponent,
      presentingElement: this.presentingElement,
      componentProps: {
        isNewAddress: false
      }
    });

    this.store.dispatch(new AddressesActions.AddAddressToState(address));

    await modal.present();
    const { data, role } = await modal.onWillDismiss();
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
  async navigateBack() {
    // this.store.dispatch(new CartActions.ClearIsGuest());
    await this.navigation.navigateFlip('/shop/tabs/profile');
  }
  detailsPage() {
    this.navigation.navigateFlip('/shop/details');
  }
  ngOnDestroy() {
    this.subscription.next(null);
    this.subscription.complete();
  }

}
