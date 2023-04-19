import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStateActions } from 'src/app/store/auth/auth.actions';
import { AuthState } from 'src/app/store/auth/auth.state';
import { UserProfileActions } from 'src/app/store/user-profile/user-profile.actions';

@Injectable({
    providedIn: 'root'
})
export class UserProfileFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;
    @Select(AuthState.userEmail) userEmail$: Observable<string>;
    @Select(AuthState.medusaId) medusaId$: Observable<string>;
    @Select(AuthState.getUser) user$: Observable<string>;
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
                this.user$,
                this.hasSession$,
            ]
        ).pipe(
            map(([
                isLoggedIn,
                userEmail,
                medusaId,
                user,
                hasSession,
            ]) => ({
                isLoggedIn,
                userEmail,
                medusaId,
                user,
                hasSession,
            }))
        );
    }
    appUploadProfileImage(formData: FormData) {
        this.store.dispatch(new UserProfileActions.UploadImage(formData))
            // .subscribe((authState) => {
            //     console.log(authState);
            // });
    }
}
