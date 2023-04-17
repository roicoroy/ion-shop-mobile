import { Injectable } from '@angular/core';
import { State, Action, StateContext, Store } from '@ngxs/store';
import { Auth0Service } from './auth0.service';
import { Auth0Actions } from './auth0.actions';
import { AuthStateActions } from '../auth.actions';
import { catchError, throwError, tap } from 'rxjs';

export class IAuth0StateModel { }
@State<IAuth0StateModel>({
    name: 'auth0',
})
@Injectable()
export class Auth0State {

    constructor(
        private auth: Auth0Service,
        private store: Store,
    ) { }

    @Action(Auth0Actions.Auth0ProviderCallback)
    async authProviderCallback(ctx: StateContext<IAuth0StateModel>, { token, provider }: Auth0Actions.Auth0ProviderCallback) {
        this.auth.callbackProviderLogin(token, provider)
            .pipe(
                catchError(err => {
                    return throwError(() => new Error(JSON.stringify(err)));
                })
            )
            .subscribe((user: any) => {
                if (user) {
                    this.store.dispatch(new AuthStateActions.SetAuthState(user));
                }
            });
    }
}
