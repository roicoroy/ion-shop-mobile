import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'shop/tabs/home',
    pathMatch: 'full',
  },

  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.routes').then((m) => m.routes),
  },
  // {
  //   path: 'message/:id',
  //   loadComponent: () =>
  //     import('./view-message/view-message.page').then((m) => m.ViewMessagePage),
  // },
  {
    path: 'auth-home',
    loadComponent: () => import('./auth/auth-home.page').then(m => m.AuthHomePage)
  },
  {
    path: 'strapi-auth0',
    loadComponent: () => import('./auth/auth0/auth0.page').then(m => m.Auth0Page)
  },
  {
    path: 'email-password',
    loadComponent: () => import('./auth/email-password/email-password.page').then(m => m.EmailPasswordPage)
  },
  {
    path: 'user',
    loadComponent: () => import('./shop/profile/user/user.page').then(m => m.UserPage)
  },
  {
    path: 'orders',
    loadChildren: () => import('./shop/profile/customer/orders/orders.module').then(m => m.OrdersPageModule)
  },
  {
    path: 'customer-addresses',
    loadChildren: () => import('./shop/profile/customer/customer-addresses/customer-addresses.module').then(m => m.CustomerAddressesPageModule)
  },
  {
    path: 'customer',
    loadComponent: () => import('./shop/profile/customer/customer.page').then(m => m.CustomerPage)
  },
];
