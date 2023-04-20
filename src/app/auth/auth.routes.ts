import { Routes } from '@angular/router';
import { AuthHomePage } from './auth-home.page';


export const routes: Routes = [
  {
    path: 'pages',
    component: AuthHomePage,
    children: [
      {
        path: 'auth-home',
        loadComponent: () => import('./auth-home.page').then(m => m.AuthHomePage)
      },
      {
        path: 'strapi-auth0',
        loadComponent: () => import('./auth0/auth0.page').then(m => m.Auth0Page)
      },
      {
        path: 'email-password',
        loadComponent: () => import('./email-password/email-password.page').then(m => m.EmailPasswordPage)
      },
      {
        path: '',
        redirectTo: '/pages/auth-home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/pages/auth-home',
    pathMatch: 'full',
  },
];
