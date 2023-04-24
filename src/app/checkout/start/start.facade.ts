import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStateActions } from 'src/app/store/auth/auth.actions';
import { AuthState } from 'src/app/store/auth/auth.state';
import { CartState } from 'src/app/store/cart/cart.state';
import { ProductsActions } from 'src/app/store/products/products.actions';

@Injectable({
    providedIn: 'root'
})
export class StartFacade {

    @Select(CartState.getCart) cart$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    readonly viewState$: Observable<any>;
    
    private store = inject(Store);

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.cart$,
                this.isLoggedIn$,
                this.customer$,
            ]
        ).pipe(
            map((
                [
                    cart,
                    isLoggedIn,
                    customer,
                ]
            ) => ({
                cart,
                isLoggedIn,
                customer,
            }))
        );
    }
    loadApp() {
        this.store.dispatch(new ProductsActions.GetProductList());
        this.store.dispatch(new AuthStateActions.LoadApp());
    }
}
