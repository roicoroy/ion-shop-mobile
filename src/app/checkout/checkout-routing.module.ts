import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { StartComponent } from './start/start.component';
import { RoutePath } from './route-path.enum';
import { ShippingComponent } from './shipping/shipping.component';
import { CartReviewComponent } from './cart-review/cart-review.component';
import { GuestComponent } from './guest/guest.component';
import { AddressDetailsComponent } from './cart-addresses/address-details/address-details.component';

const routes: Routes = [
  {
    path: 'flow',
    children: [
      {
        path: '',
        redirectTo: RoutePath.start,
        pathMatch: 'full'
      },
      {
        path: RoutePath.start,
        component: StartComponent,
      },
      {
        path: 'cart-addresses',
        loadChildren: () => import('./cart-addresses/cart-addresses.module').then(m => m.CartAddressesPageModule)
      },
      {
        path: RoutePath.shipping,
        component: ShippingComponent,
      },
      {
        path: RoutePath.payment,
        component: PaymentComponent,
      },
      {
        path: RoutePath.cartReview,
        component: CartReviewComponent,
      },
      {
        path: 'guest',
        component: GuestComponent,
      },
      {
        path: 'address-details',
        component: AddressDetailsComponent,
      },
      {
        path: 'order-review',
        loadChildren: () => import('./order-review/order-review.module').then( m => m.OrderReviewPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutPageRoutingModule { }
