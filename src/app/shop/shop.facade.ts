import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/auth.state';
import { ProductState } from 'src/app/store/products/products.state';
import { CartActions } from '../store/cart/cart.actions';
import { AuthStateActions } from '../store/auth/auth.actions';
import { GetProductList } from '../store/products/products.actions';
import { UtilityService } from '../shared/services/utility/utility.service';


export interface IShopFacadeState {
    customer: any,
    isLoggedIn: boolean,
    selectedVariant: any,
    productList: any,
}

@Injectable({
    providedIn: 'root'
})
export class ShopFacade {

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<any>;

    @Select(ProductState.getSelectedProduct) selectedProduct$: Observable<any>;

    @Select(ProductState.getSelectedVariant) selectedVariant$: Observable<any>;

    @Select(ProductState.getProductList) productList$: Observable<any>;

    private store = inject(Store);
    private utility = inject(UtilityService);

    readonly viewState$: Observable<IShopFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.customer$,
                this.isLoggedIn$,
                this.selectedProduct$,
                this.selectedVariant$,
                this.productList$,
            ]
        ).pipe(
            map((
                [
                    customer,
                    isLoggedIn,
                    selectedProduct,
                    selectedVariant,
                    productList
                ]
            ) => ({
                customer,
                isLoggedIn,
                selectedProduct,
                selectedVariant,
                productList,
            }))
        );
    }
    loadApp() {
        this.store.dispatch(new AuthStateActions.LoadApp());
    }
    addToMedusaCart(selectedVariantId: string, counterValue: number) {
        const isLoggedIn = this.store.selectSnapshot<any>((state) => state.authState.isLoggedIn);
        if (isLoggedIn) {
            const cartId = this.store.selectSnapshot<any>((state) => state.cart?.cart?.id);
            if (cartId != null && selectedVariantId != null) {
                this.store.dispatch(new AuthStateActions.getMedusaSession());
                this.store.dispatch(new CartActions.AddProductMedusaToCart(cartId, counterValue, selectedVariantId));
            } else {

                this.store.dispatch(new AuthStateActions.getMedusaSession());

                this.store.dispatch(new CartActions.CreateMedusaCart())
                    .subscribe((state) => {
                        this.store.dispatch(new CartActions.AddProductMedusaToCart(state.cart.cart?.id, counterValue, selectedVariantId));
                    });
            }
        } else {
            this.utility.presentAlert('Need to login first, please...');
        }
    }
}
