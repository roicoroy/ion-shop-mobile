import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from './store/auth/auth.state';

export interface IAppFacadeState {
    isLoggedIn: boolean;
    customer: any;
}

@Injectable({
    providedIn: 'root'
})
export class AppFacade {

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;

    
    readonly viewState$: Observable<IAppFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.customer$,
                this.isLoggedIn$,
            ]
        ).pipe(
            map((
                [
                    customer,
                    isLoggedIn,]
            ) => ({
                customer,
                isLoggedIn,
            }))
        );
    }
}
