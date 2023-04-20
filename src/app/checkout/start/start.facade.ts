import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/auth.state';
import { CartState } from 'src/app/store/cart/cart.state';

@Injectable({
    providedIn: 'root'
})
export class StartFacade {

    @Select(CartState.getCart) cart$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    readonly viewState$: Observable<any>;

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
}
