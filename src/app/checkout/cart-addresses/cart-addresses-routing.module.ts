import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartAddressesPage } from './cart-addresses.page';

const routes: Routes = [
  {
    path: '',
    component: CartAddressesPage
  },
  // {
  //   path: 'address-details-page',
  //   loadChildren: () => import('./details/details.module').then(m => m.DetailsPageModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartAddressesPageRoutingModule {}
