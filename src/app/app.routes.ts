import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'start/tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'start',
    loadChildren: () => import('./start/start.routes').then(m => m.routes)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.routes').then((m) => m.routes),
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then((m) => m.CheckoutPageModule),
  },
  {
    path: 'user',
    loadComponent: () => import('./start/profile/user/user.page').then(m => m.UserPage)
  },
  {
    path: 'orders',
    loadComponent: () => import('./start/profile/customer/orders/orders.module').then(m => m.OrdersPageModule)
  },
  {
    path: 'customer-addresses',
    loadComponent: () => import('./start/profile/customer/customer-addresses/customer-addresses.module').then(m => m.CustomerAddressesPageModule)
  },
  {
    path: 'customer',
    loadComponent: () => import('./start/profile/customer/customer.page').then(m => m.CustomerPage)
  },
];
