import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Auth0Service } from './auth0.service';
import { Auth0Actions } from './auth0.actions';
import { AuthStateActions } from '../auth.actions';

export class IAuth0StateModel {
    // user: any;
    // isLoggedIn: boolean;
    // token: string;
    // userId: string;
    // medusaId: string
}
@State<IAuth0StateModel>({
    name: 'auth0',
    // defaults: {
    //     // user: null,
    //     // isLoggedIn: null,
    //     // token: null,
    //     // userId: null,
    //     // medusaId: null
    // }
})
@Injectable()
export class Auth0State {

    constructor(
        private auth: Auth0Service,
        private store: Store,
    ) { }

    @Action(Auth0Actions.Auth0ProviderCallback)
    async authProviderCallback(ctx: StateContext<IAuth0StateModel>, { token, provider }: Auth0Actions.Auth0ProviderCallback) {
        const state = ctx.getState();
        this.auth.callbackProviderLogin(token, provider)
            .subscribe((user: any) => {
                console.log(user);
                if (user) {
                    this.store.dispatch(new AuthStateActions.SetLoggedIn(true))
                    this.store.dispatch(new AuthStateActions.SetUser(user?.user))
                }
            });
    }
}
