import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth-home',
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
    loadComponent: () => import('./auth/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'passwordless',
    loadComponent: () => import('./auth/passwordless/passwordless.page').then(m => m.PasswordlessPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login-email/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/login-email/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'forgot',
    loadComponent: () => import('./auth/login-email/forgot/forgot.page').then(m => m.ForgotPage)
  },
  {
    path: 'reset',
    loadComponent: () => import('./auth/login-email/reset/reset.page').then(m => m.ResetPage)
  },
  {
    path: 'auth0-callback',
    loadComponent: () => import('./auth/auth0-callback/auth0-callback.page').then( m => m.Auth0CallbackPage)
  },
];
