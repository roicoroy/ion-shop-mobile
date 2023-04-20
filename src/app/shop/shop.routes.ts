import { Routes } from '@angular/router';
import { ShopPage } from './shop.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: ShopPage,
    children: [
      {
        path: 'products-list',
        loadComponent: () => import('./products-list/products-list.page').then( m => m.ProductsListPage)
      },
      {
        path: '',
        redirectTo: '/tabs/product-list',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/product-list',
    pathMatch: 'full',
  },
];
