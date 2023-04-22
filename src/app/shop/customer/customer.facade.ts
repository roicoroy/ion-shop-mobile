import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/auth.state';

@Injectable({
    providedIn: 'root'
})
export class CustomerFacade {

    @Select(AuthState.getSession) session$: Observable<any>;

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<any>;

    private store = inject(Store);

    readonly viewState$: Observable<any>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.session$,
                this.customer$,
                this.isLoggedIn$,
            ]
        ).pipe(
            map((
                [
                    session,
                    customer,
                    isLoggedIn,
                ]
            ) => ({
                session,
                customer,
                isLoggedIn,
            }))
        );
    }
}
