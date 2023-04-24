import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddressDetailsFacade } from './customer-address-details.facade';
import { AddressDetailsFormComponent } from 'src/app/form-components/components/address-details-form /address-details-form.component';

import { AddressesActions } from 'src/app/store/addresses/addresses.actions';
import { FormGroupDirective } from '@angular/forms';
import { IRegisterAddress } from 'src/app/shared/types/types.interfaces';

@Component({
  selector: 'app-customer-address-details',
  templateUrl: './customer-address-details.component.html',
  styleUrls: ['./customer-address-details.component.scss'],
  providers: [FormGroupDirective]
})
export class CustomerAddressDetailsComponent implements OnDestroy {

  @Input() isNewAddress: boolean;

  @ViewChild('addressDetailsForm') addressDetailsForm: AddressDetailsFormComponent;

  viewState$: Observable<any>;

  constructor(
    private modalCtrl: ModalController,
    private store: Store,
    private readonly facade: AddressDetailsFacade,
  ) {
    this.viewState$ = this.facade.viewState$;
  }
  ionViewWillEnter() {
    this.viewState$
      .subscribe((vs) => {
        return this.isNewAddress ? this.populateEditForm(vs.selectedAddress) : this.clearForm();
      });
  }
  async populateEditForm(address: IRegisterAddress) {
    const regionList = this.store.selectSnapshot<any>((state) => state.addresses.regionList);
    const region_code = this.buildRegionCode(address?.country_code, regionList);
    this.addressDetailsForm.adressDetailsForm.get('region_code').setValue(region_code);

    this.addressDetailsForm.adressDetailsForm.get('first_name').setValue(address?.first_name);
    this.addressDetailsForm.adressDetailsForm.get('last_name').setValue(address?.last_name);
    this.addressDetailsForm.adressDetailsForm.get('address_1').setValue(address?.address_1);
    this.addressDetailsForm.adressDetailsForm.get('address_2').setValue(address?.address_2);

    this.addressDetailsForm.adressDetailsForm.get('country').setValue(address?.country_code);

    this.addressDetailsForm.adressDetailsForm.get('city').setValue(address?.city);
    this.addressDetailsForm.adressDetailsForm.get('postal_code').setValue(address?.postal_code);
    this.addressDetailsForm.adressDetailsForm.get('phone').setValue(address?.phone);
  }
  buildRegionCode(country_code: string, regionList: any) {
    if (regionList != null) {
      const countries = regionList.map((region: any, i: any) => region.countries);
      const result = [].concat(...countries);
      const filtered = result.filter((region: any) => {
        return region.iso_2 === country_code;
      });
      return filtered[0]?.region_id;
    }
  }
  async submitAddressForm() {
    // const cart = this.store.selectSnapshot<any>((state) => state.cart.cart);
    const address: IRegisterAddress = {
      first_name: this.addressDetailsForm.adressDetailsForm.get('first_name').value,
      last_name: this.addressDetailsForm.adressDetailsForm.get('last_name').value,
      address_1: this.addressDetailsForm.adressDetailsForm.get('address_1').value,
      address_2: this.addressDetailsForm.adressDetailsForm.get('address_2').value,
      region_code: this.addressDetailsForm.adressDetailsForm.get('region_code').value,
      country_code: this.addressDetailsForm.adressDetailsForm.get('country').value,
      city: this.addressDetailsForm.adressDetailsForm.get('city').value,
      postal_code: this.addressDetailsForm.adressDetailsForm.get('postal_code').value,
      phone: this.addressDetailsForm.adressDetailsForm.get('phone').value,
    };
    if (this.isNewAddress === true) {
      this.modalCtrl.dismiss(address, 'dismiss');
    }
    if (this.isNewAddress === false) {
      this.modalCtrl.dismiss(address, 'dismiss');
    }
  }
  clearForm() {
    this.store.dispatch(new AddressesActions.RemoveAddressFromState());
  }
  ngOnDestroy(): void {
    this.clearForm();
  }
  async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
