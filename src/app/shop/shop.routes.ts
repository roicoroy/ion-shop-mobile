import { Routes } from '@angular/router';
import { ShopPage } from './shop.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: ShopPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
      },
      // {
      //   path: 'customer',
      //   loadComponent: () => import('./profile/customer/customer.page').then(m => m.CustomerPage)
      // },
      // {
      //   path: 'orders',
      //   loadChildren: () => import('./profile/customer/orders/orders.module').then(m => m.OrdersPageModule)
      // },
      // {
      //   path: 'customer-addresses',
      //   loadChildren: () => import('./profile/customer/customer-addresses/customer-addresses.module').then( m => m.CustomerAddressesPageModule)
      // },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
