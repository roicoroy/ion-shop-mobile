import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/auth.state';
import { ProductState } from 'src/app/store/products/products.state';


export interface IProductsListFacadeState {
    customer: any,
    isLoggedIn: boolean,
    selectedVariant: any,
    productList: any,
}

@Injectable({
    providedIn: 'root'
})
export class ProductsListFacade {

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<any>;

    @Select(ProductState.getSelectedVariant) selectedVariant$: Observable<any>;

    @Select(ProductState.getProductList) productList$: Observable<any>;

    readonly viewState$: Observable<IProductsListFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.customer$,
                this.isLoggedIn$,
                this.selectedVariant$,
                this.productList$,
            ]
        ).pipe(
            map((
                [
                    customer,
                    isLoggedIn,
                    selectedVariant,
                    productList
                ]
            ) => ({
                customer,
                isLoggedIn,
                selectedVariant,
                productList,
            }))
        );
    }
}
