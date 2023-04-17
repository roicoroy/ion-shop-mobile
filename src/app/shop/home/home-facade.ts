import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../../store/auth/auth.state';
import { AuthStateActions } from '../../store/auth/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class HomePageFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;
    @Select(AuthState.userEmail) userEmail$: Observable<string>;
    @Select(AuthState.medusaId) medusaId$: Observable<string>;
    @Select(AuthState.hasSession) hasSession$: Observable<string>;

    readonly viewState$: Observable<any>;
    private store = inject(Store);
    constructor(

    ) {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
                this.userEmail$,
                this.medusaId$,
                this.hasSession$,
            ]
        ).pipe(
            map(([
                isLoggedIn,
                userEmail,
                medusaId,
                hasSession,
            ]) => ({
                isLoggedIn,
                userEmail,
                medusaId,
                hasSession,
            }))
        );
    }
    appLogout() {
        this.store.dispatch(new AuthStateActions.AuthStateLogout()).subscribe((authState) => {
            console.log(authState);
        });
    }
}
