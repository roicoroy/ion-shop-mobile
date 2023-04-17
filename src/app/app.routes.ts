import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  // {
  //   path: 'message/:id',
  //   loadComponent: () =>
  //     import('./view-message/view-message.page').then((m) => m.ViewMessagePage),
  // },
  {
    path: 'auth-home',
    loadComponent: () => import('./auth/auth-home/auth-home.page').then(m => m.HomePage)
  },
  {
    path: 'strapi-auth0',
    loadComponent: () => import('./auth/auth0/auth0.page').then( m => m.Auth0Page)
  },
  {
    path: 'email-password',
    loadComponent: () => import('./auth/email-password/email-password.page').then( m => m.EmailPasswordPage)
  },
];
