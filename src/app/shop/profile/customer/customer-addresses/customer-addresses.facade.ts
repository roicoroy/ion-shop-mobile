import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerState } from 'src/app/store/customer/customer.state';

@Injectable({
    providedIn: 'root'
})
export class CutomerAddressDetailsFacade {

    // @Select(CartState.getIsGuest) isGuest$: Observable<any>;

    // @Select(CartState.getCart) cart$: Observable<any>;

    // @Select(CustomerState.getCustomer) customer$: Observable<any>;

    // @Select(CustomerState.getSession) session$: Observable<any>;

    // @Select(CustomerState.isLoggedIn) isCustomerLoggedIn$: Observable<any>;


    readonly viewState$: Observable<any>;

    // constructor() {
    //     this.viewState$ = combineLatest(
    //         [
    //             this.isCustomerLoggedIn$,
    //             this.cart$,
    //             this.customer$,
    //             this.session$,
    //         ]
    //     ).pipe(
    //         map(([
    //             isCustomerLoggedIn,
    //             cart,
    //             customer,
    //             session
    //         ]) => ({
    //             isCustomerLoggedIn,
    //             cart,
    //             customer,
    //             session
    //         }))
    //     );
    // }
}
