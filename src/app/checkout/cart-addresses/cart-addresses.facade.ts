import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/auth.state';
import { CartState } from 'src/app/store/cart/cart.state';
import { CustomerState } from 'src/app/store/customer/customer.state';

@Injectable({
    providedIn: 'root'
})
export class AddressesFacade {

    @Select(CartState.getIsGuest) isGuest$: Observable<any>;

    @Select(CartState.getCart) cart$: Observable<any>;

    @Select(AuthState.getSession) session$: Observable<any>;
    
    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    readonly viewState$: Observable<any>;

    constructor(
        private store: Store,
    ) {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
                this.cart$,
                this.customer$,
                this.session$,
            ]
        ).pipe(
            map(([
                isCustomerLoggedIn,
                cart,
                customer,
                session
            ]) => ({
                isCustomerLoggedIn,
                cart,
                customer,
                session
            }))
        );
    }
}
