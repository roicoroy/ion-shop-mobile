import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerAddressesPageRoutingModule } from './customer-addresses-routing.module';

import { CustomerAddressesPage } from './customer-addresses.page';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { CustomComponentsModule } from 'projects/components/src/public-api';
import { FormComponentsModule } from 'projects/form-components/src/public-api';
import { CustomerAddressDetailsComponent } from './customer-address-details/customer-address-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerAddressesPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    CustomComponentsModule,
    FormComponentsModule,
    NgxsStoragePluginModule,
  ],
  declarations: [
    CustomerAddressesPage,
    CustomerAddressDetailsComponent
  ]
})
export class CustomerAddressesPageModule {}
