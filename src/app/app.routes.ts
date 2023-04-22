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
    path: 'product-details',
    loadComponent: () => import('./shop/products-list/product-details/product-details.page').then( m => m.ProductDetailsPage)
  },
  {
    path: 'user',
    loadComponent: () => import('./start/profile/user/user.page').then(m => m.UserPage)
  },
  {
    path: 'orders',
    loadComponent: () => import('./shop/customer/orders/orders.page').then(m => m.OrdersPage)
  },
  {
    path: 'customer-addresses',
    loadChildren: () => import('./shop/customer/customer-addresses/customer-addresses.module').then(m => m.CustomerAddressesPageModule)
  },
  {
    path: 'customer',
    loadComponent: () => import('./shop/customer/customer.page').then(m => m.CustomerPage)
  },
];
