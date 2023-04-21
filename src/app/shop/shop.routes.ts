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
      // {
      //   path: 'product-details',
      //   loadComponent: () => import('./product-details/product-details.page').then( m => m.ProductDetailsPage)
      // },
      // {
      //   path: 'variant-modal',
      //   loadComponent: () => import('./variant-modal/variant-modal.page').then( m => m.VariantModalPage)
      // },
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
