import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Auth0State } from './auth0/auth0.state';
import { AuthStateActions } from './auth.actions';
import { Auth0Actions } from './auth0/auth0.actions';

export class IAuthStateModel {
    isLoggedIn: boolean;
    userId: string;
    medusaId: string
}

export const AuthStates = [
    Auth0State
];

@State<IAuthStateModel>({
    name: 'auth',
    defaults: {
        isLoggedIn: null,
        userId: null,
        medusaId: null
    },
    children: AuthStates
})
@Injectable()
export class AuthState {

    @Selector()
    static isLoggedIn(state: IAuthStateModel) {
        return state.isLoggedIn;
    }

    @Action(AuthStateActions.SetLoggedIn)
    async authProviderCallback(ctx: StateContext<IAuthStateModel>, { isLoggedIn }: AuthStateActions.SetLoggedIn) {
        const state = ctx.getState();
        return ctx.patchState({
            ...state,
            isLoggedIn
        });
    }
    @Action(AuthStateActions.SetUser)
    async setUser(ctx: StateContext<IAuthStateModel>, { user }: AuthStateActions.SetUser) {
        const state = ctx.getState();
        console.log(user);
        return ctx.patchState({
            ...state,
            userId: user.id,
            isLoggedIn: true
        });
    }
}
