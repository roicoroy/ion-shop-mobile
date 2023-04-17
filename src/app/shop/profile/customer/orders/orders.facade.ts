import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerState } from 'src/app/store/customer/customer.state';

@Injectable({
    providedIn: 'root'
})
export class OrdersFacade {

    // @Select(CustomerState.getSession) session$: Observable<any>;

    // @Select(CustomerState.getCustomer) customer$: Observable<any>;

    // @Select(CustomerState.isLoggedIn) isCustomerLoggedIn$: Observable<any>;

    readonly viewState$: Observable<any>;

    // constructor() {
    //     this.viewState$ = combineLatest(
    //         [
    //             this.session$,
    //             this.customer$,
    //             this.isCustomerLoggedIn$,
    //         ]
    //     ).pipe(
    //         map((
    //             [
    //                 session,
    //                 customer,
    //                 isCustomerLoggedIn,
    //             ]
    //         ) => ({
    //             session,
    //             customer,
    //             isCustomerLoggedIn,
    //         }))
    //     );
    // }
}
