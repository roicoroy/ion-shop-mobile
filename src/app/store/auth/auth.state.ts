import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Auth0State } from './auth0/auth0.state';
import { AuthStateActions } from './auth.actions';
import { IAuthStateModel } from './auth.interface';
import { TokenService, IResAuthRegister, IResAuthLogin } from 'projects/strapi-auth/src/public-api';
import Medusa from "@medusajs/medusa-js";
import { environment } from 'src/environments/environment';
import { ICustomerLoginData, ICustomerRegisterData } from 'projects/types/types.interfaces';
import { CustomerActions } from '../customer/customer.actions';
import { AuthStateService } from './auth-state.service';

export const AuthStates = [
    Auth0State
];

@State<IAuthStateModel>({
    name: 'authState',
    defaults: {
        isLoggedIn: null,
        userId: null,
        userEmail: null,
        medusaId: null,
        hasSession: null
    },
    // children: AuthStates
})
@Injectable()
export class AuthState {
    private store = inject(Store);
    private authService = inject(AuthStateService);

    medusa: any;

    constructor(
        private tokenService: TokenService,
    ) {
        this.medusa = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }

    @Selector()
    static isLoggedIn(state: IAuthStateModel) {
        return state.isLoggedIn;
    }

    @Selector()
    static userId(state: IAuthStateModel) {
        return state.userId;
    }
    @Selector()
    static userEmail(state: IAuthStateModel) {
        return state.userEmail;
    }
    @Selector()
    static medusaId(state: IAuthStateModel) {
        return state.medusaId;
    }
    @Selector()
    static hasSession(state: IAuthStateModel) {
        return state.hasSession;
    }
    @Action(AuthStateActions.SetAuthState)
    async setAuthState(ctx: StateContext<IAuthStateModel>, { user }: AuthStateActions.SetAuthState) {
        const state = ctx.getState();
        if (user.jwt && user.user) {
            this.setTokenResponse(user);
            const medusaCustomerID = await this.medusaCartInit(user.user.email);
            if (medusaCustomerID) {
                ctx.patchState({
                    ...state,
                    isLoggedIn: true,
                    userEmail: user.user.email,
                    userId: user.user.id,
                    medusaId: medusaCustomerID,
                    hasSession: true,
                });
            }
        }
    }

    @Action(AuthStateActions.CreateMedusaCustomer)
    async CreateMedusaCustomer(ctx: StateContext<IAuthStateModel>, { email, password }: AuthStateActions.CreateMedusaCustomer) {
        const state = ctx.getState();
        const medusaCustomerID = await this.medusaCartInit(email);
        if (medusaCustomerID) {
            ctx.patchState({
                ...state,
                isLoggedIn: true,
                medusaId: medusaCustomerID,
                hasSession: true,
            });
        }
    }

    async medusaCartInit(email: string, password?: string): Promise<string> {
        const medusaEmailExist = await this.medusa.auth.exists(email);
        if (medusaEmailExist.exists) {
            const loginReq: ICustomerLoginData = {
                email: email,
                password: email,
            };
            let loggedInCustomer = await this.medusa.auth?.authenticate(loginReq);
            return loggedInCustomer.customer.id;
        } else {
            const registerRequest: ICustomerRegisterData = {
                email: email,
                password: email,
            };
            let registeredCustomer = await this.medusa.customers?.create(registerRequest);
            return registeredCustomer.customer.id;
        }
    }
    async getMedusaSession(): Promise<any> {
        let sessionRes = await this.medusa.auth?.getSession();
        let customerRes = await this.medusa.customers.retrieve();
        return { sessionRes, customerRes };
    }
    @Action(AuthStateActions.getMedusaSession)
    async getSession(ctx: StateContext<IAuthStateModel>) {
        const userEmail = await this.store.selectSnapshot<any>((state: any) => state.authState?.userEmail);
        try {
            const id = await this.medusaCartInit(userEmail);
            if (id) {
                const session = await this.getMedusaSession();
                if (session.sessionRes?.customer != null
                    && session.sessionRes.response?.status === 200
                    && session.customerRes?.customer != null
                    && session.customerRes.response?.status === 200
                ) {
                    ctx.patchState({
                        isLoggedIn: true,
                        userEmail: session.sessionRes?.customer.email,
                        medusaId: session.customerRes?.customer.id,
                        hasSession: true,
                    });
                }
            }
        } catch (err: any) {
            if (err) {
                const state = ctx.getState();
                ctx.patchState({
                    ...state,
                    hasSession: false,
                });
            }
        }
    }
    // @Action(AuthStateActions.SetLoggedIn)
    // authProviderCallback(ctx: StateContext<IAuthStateModel>, { isLoggedIn }: AuthStateActions.SetLoggedIn) {
    //     const state = ctx.getState();
    //     ctx.patchState({
    //         ...state,
    //         isLoggedIn,
    //     });
    // }
    // @Action(AuthStateActions.SetUserId)
    // setUserId(ctx: StateContext<IAuthStateModel>, { userId }: AuthStateActions.SetUserId) {
    //     const state = ctx.getState();
    //     ctx.patchState({
    //         ...state,
    //         userId,
    //         isLoggedIn: true
    //     });
    // }
    // @Action(AuthStateActions.SetUserEmail)
    // setUserEmail(ctx: StateContext<IAuthStateModel>, { userEmail }: AuthStateActions.SetUserEmail) {
    //     const state = ctx.getState();
    //     ctx.patchState({
    //         ...state,
    //         userEmail,
    //         isLoggedIn: true
    //     });
    // }
    @Action(AuthStateActions.AuthStateLogout)
    authStateLogout(ctx: StateContext<IAuthStateModel>, { }: AuthStateActions.AuthStateLogout) {
        this.authService.medusaLogout();
        this.tokenService.deleteToken();
        return ctx.setState({
            isLoggedIn: null,
            userId: null,
            userEmail: null,
            medusaId: null,
            hasSession: null
        });
    }
    /**
     * Write token to store and
     * call auth state subject
     */
    setTokenResponse(res: IResAuthRegister | IResAuthLogin): void {
        if (res.jwt && res.user) {
            this.tokenService.setToken(res.jwt);
        }
    }
}
