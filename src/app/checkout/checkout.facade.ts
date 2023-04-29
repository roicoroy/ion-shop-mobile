import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/auth.state';
import { ProductState } from 'src/app/store/products/products.state';
import { UtilityService } from '../shared/services/utility/utility.service';
import { IUser } from '../shared/types/models/User';

export interface ICheckoutFacadeState {
    user: IUser,
    customer: any,
    isLoggedIn: boolean,
    selectedVariant: any,
    productList: any,
}

@Injectable({
    providedIn: 'root'
})
export class CheckoutFacade {

    @Select(AuthState.getUser) user$: Observable<any>;

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<any>;

    @Select(ProductState.getSelectedProduct) selectedProduct$: Observable<any>;

    @Select(ProductState.getSelectedVariant) selectedVariant$: Observable<any>;

    @Select(ProductState.getProductList) productList$: Observable<any>;

    private store = inject(Store);

    private utility = inject(UtilityService);

    readonly viewState$: Observable<ICheckoutFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.user$,
                this.customer$,
                this.isLoggedIn$,
                this.selectedProduct$,
                this.selectedVariant$,
                this.productList$,
            ]
        ).pipe(
            map((
                [
                    user,
                    customer,
                    isLoggedIn,
                    selectedProduct,
                    selectedVariant,
                    productList
                ]
            ) => ({
                user,
                customer,
                isLoggedIn,
                selectedProduct,
                selectedVariant,
                productList,
            }))
        );
    }
    loadApp() {
        // this.store.dispatch(new AuthStateActions.LoadApp());
    }
}
