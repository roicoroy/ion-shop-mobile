import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CartAddressesPageRoutingModule } from './cart-addresses-routing.module';
import { CartAddressesPage } from './cart-addresses.page';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsModule } from '@ngxs/store';
import { CustomComponentsModule } from 'projects/components/src/public-api';
import { FormComponentsModule } from 'projects/form-components/src/public-api';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartAddressesPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    CustomComponentsModule,
    FormComponentsModule,
    NgxsStoragePluginModule,
  ],
  declarations: [
    CartAddressesPage,
    AddressDetailsComponent
  ],
  exports: [
    CartAddressesPage,
    AddressDetailsComponent
  ]
})
export class CartAddressesPageModule { }
