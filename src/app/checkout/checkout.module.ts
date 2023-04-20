import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutPageRoutingModule } from './checkout-routing.module';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgxStripeModule } from 'ngx-stripe';
import { StartComponent } from './start/start.component';
import { PaymentComponent } from './payment/payment.component';
import { ShippingComponent } from './shipping/shipping.component';
import { CustomComponentsModule } from 'projects/components/src/public-api';
import { FormComponentsModule } from 'projects/form-components/src/public-api';
import { CartReviewComponent } from './cart-review/cart-review.component';
import { GuestComponent } from './guest/guest.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutPageRoutingModule,
    NgxsModule,
    NgxsFormPluginModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule,
    CustomComponentsModule,
    FormComponentsModule
  ],
  declarations: [
    StartComponent,
    ShippingComponent,
    PaymentComponent,
    CartReviewComponent,
    GuestComponent
  ],
  exports: [
    StartComponent,
    ShippingComponent,
    PaymentComponent,
    CustomComponentsModule,
    FormComponentsModule,
    CartReviewComponent,
    GuestComponent
  ]
})
export class CheckoutPageModule { }
