import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Auth0State } from './auth0/auth0.state';
import { AuthStateActions } from './auth.actions';
import { IAuthStateModel } from './auth.interface';

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
    authProviderCallback(ctx: StateContext<IAuthStateModel>, { isLoggedIn }: AuthStateActions.SetLoggedIn) {
        const state = ctx.getState();
        ctx.patchState({
            ...state,
            isLoggedIn
        });
        // console.log(state);
    }
    @Action(AuthStateActions.SetUserId)
    setUser(ctx: StateContext<IAuthStateModel>, { userId }: AuthStateActions.SetUserId) {
        const state = ctx.getState();
        ctx.patchState({
            ...state,
            userId,
            isLoggedIn: true
        });
        console.log(state);
    }
}
