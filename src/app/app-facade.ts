import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from './store/auth/auth.state';
import { IUser } from './shared/types/models/User';

@Injectable({
    providedIn: 'root'
})
export class AppFacade {

    @Select(AuthState.getUser) user$: Observable<IUser>;

    readonly viewState$: Observable<any>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.user$
            ]
        ).pipe(
            map(([
                user
            ]) => ({
                user
            }))
        );
    }
}
