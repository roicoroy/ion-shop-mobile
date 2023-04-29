import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest, map } from 'rxjs';
import { CartState } from 'src/app/store/cart/cart.state';
import { ShippingState } from 'src/app/store/shipping/shipping.state';
import { AuthState } from 'src/app/store/auth/auth.state';

export interface IShippingFacadeState {
    shippingOptions: any,
    paymentSessions: any,
    isLoggedIn: any,
    cart: any,
}

@Injectable({
    providedIn: 'root'
})
export class ShippingFacade {

    @Select(ShippingState.getShippingOptions) shippingOptions$: Observable<any>;

    @Select(ShippingState.getPaymentSessions) paymentSessions$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;

    @Select(CartState.getCart) cart$: Observable<any>;

    readonly viewState$: Observable<IShippingFacadeState>;

    constructor() {

        this.viewState$ = combineLatest(
            [
                this.shippingOptions$,
                this.paymentSessions$,
                this.isLoggedIn$,
                this.cart$,
            ]
        ).pipe(
            map(([
                shippingOptions,
                paymentSessions,
                isLoggedIn,
                cart
            ]) => ({
                shippingOptions,
                paymentSessions,
                isLoggedIn,
                cart
            }))
        );
    }
}
