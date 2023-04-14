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
  {
    path: 'message/:id',
    loadComponent: () =>
      import('./view-message/view-message.page').then((m) => m.ViewMessagePage),
  },
  {
    path: 'auth-home',
    loadComponent: () => import('./auth/auth-home/auth-home.page').then(m => m.HomePage)
  },
  {
    path: 'passwordless',
    loadComponent: () => import('./auth/passwordless/passwordless.page').then(m => m.PasswordlessPage)
  },
  {
    path: 'auth0-callback',
    loadComponent: () => import('./auth/auth0-callback/auth0-callback.page').then( m => m.Auth0CallbackPage)
  },
];
