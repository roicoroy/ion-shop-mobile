import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/auth.state';
import { ProductState } from 'src/app/store/products/products.state';

@Injectable({
    providedIn: 'root'
})
export class ProductDetailFacade {

    @Select(ProductState.getSelectedVariant) selectedVariant$: Observable<any>;

    @Select(ProductState.getSelectedProduct) selectedProduct$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<any>;

    readonly viewState$: Observable<any>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.selectedVariant$,
                this.selectedProduct$,
                this.isLoggedIn$,
            ]
        ).pipe(
            map((
                [
                    selectedVariant,
                    selectedProduct,
                    isLoggedIn,
                ]
            ) => ({
                selectedVariant,
                selectedProduct,
                isLoggedIn,
            }))
        );
    }
}
