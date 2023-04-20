import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest, map } from 'rxjs';
import { AuthState } from 'src/app/store/auth/auth.state';
import { CartState } from 'src/app/store/cart/cart.state';

@Injectable({
    providedIn: 'root'
})
export class GuestFacade {

    @Select(AuthState.isLoggedIn) isCustomerLoggedIn$: Observable<any>;

    @Select(CartState.getCart) cart$: Observable<any>;

    readonly viewState$: Observable<any>;

    constructor() {

        this.viewState$ = combineLatest(
            [
                this.isCustomerLoggedIn$,
                this.cart$,
            ]
        ).pipe(
            map(([
                isCustomerLoggedIn,
                cart
            ]) => ({
                isCustomerLoggedIn,
                cart
            }))
        );
    }
}
