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
    path: 'user',
    loadComponent: () => import('./start/profile/user/user.page').then(m => m.UserPage)
  },
  {
    path: 'orders',
    loadChildren: () => import('./start/profile/customer/orders/orders.module').then(m => m.OrdersPageModule)
  },
  {
    path: 'customer-addresses',
    loadChildren: () => import('./start/profile/customer/customer-addresses/customer-addresses.module').then(m => m.CustomerAddressesPageModule)
  },
  {
    path: 'customer',
    loadComponent: () => import('./start/profile/customer/customer.page').then(m => m.CustomerPage)
  },
];
