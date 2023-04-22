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
import { CustomerAddressDetailsComponent } from './customer-address-details/customer-address-details.component';
import { CustomComponentsModule } from 'src/app/components/components.module';
import { FormComponentsModule } from 'src/app/form-components/form-components.module';

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
