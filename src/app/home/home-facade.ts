import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map} from 'rxjs/operators';
import { AuthState } from '../store/auth/auth.state';

@Injectable({
    providedIn: 'root'
})
export class HomePageFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<any>;

    readonly viewState$: Observable<any>;

    constructor(

    ) {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$
            ]
        ).pipe(
            map(([
                isLoggedIn
            ]) => ({
                isLoggedIn
            }))
        );
    }
}
