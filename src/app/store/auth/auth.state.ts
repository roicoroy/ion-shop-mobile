import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Auth0State } from './auth0/auth0.state';
import { AuthStateActions } from './auth.actions';
import { IAuthStateModel } from './auth.interface';
import { TokenService, IResAuthRegister, IResAuthLogin } from 'projects/strapi-auth/src/public-api';
import Medusa from "@medusajs/medusa-js";
import { environment } from 'src/environments/environment';
import { ICustomerLoginData, ICustomerRegisterData } from 'projects/types/types.interfaces';
import { AuthStateService } from './auth-state.service';
import { ErrorLoggingActions } from '../error-logging/error-logging.actions';

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
        try {
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
        } catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                const state = ctx.getState();
                ctx.patchState({
                    ...state,
                    hasSession: false,
                });
            }
        }
    }

    @Action(AuthStateActions.CreateMedusaCustomer)
    async CreateMedusaCustomer(ctx: StateContext<IAuthStateModel>, { email, password }: AuthStateActions.CreateMedusaCustomer) {
        const state = ctx.getState();
        const medusaCustomerID = await this.medusaCartInit(email);
        try {
            if (medusaCustomerID) {
                ctx.patchState({
                    ...state,
                    isLoggedIn: true,
                    medusaId: medusaCustomerID,
                    hasSession: true,
                });
            }
        } catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                const state = ctx.getState();
                ctx.patchState({
                    ...state,
                    hasSession: false,
                });
            }
        }
    }

    async medusaCartInit(email: string, password?: string) {
        try {
            const medusaEmailExist = await this.medusa.auth.exists(email);
            if (medusaEmailExist.exists) {
                const loginReq: ICustomerLoginData = {
                    email: email,
                    password: email,
                };
                let loggedInCustomer = await this.medusa.auth?.authenticate(loginReq);
                return loggedInCustomer.customer.id;
            }
            else {
                const registerRequest: ICustomerRegisterData = {
                    email: email,
                    password: email,
                };
                let registeredCustomer = await this.medusa.customers?.create(registerRequest);
                return registeredCustomer.customer.id;
            }
        } catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    async getMedusaSession(): Promise<any> {
        try {
            let sessionRes = await this.medusa.auth?.getSession();
            let customerRes = await this.medusa.customers.retrieve();
            return { sessionRes, customerRes };
        } catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }

    }
    @Action(AuthStateActions.getMedusaSession)
    async getSession(ctx: StateContext<IAuthStateModel>) {
        const userEmail = await this.store.selectSnapshot<any>((state: any) => state.authState?.userEmail);
        try {
            const id = await this.medusaCartInit(userEmail);
            if (id) {
                const sessionRes = await this.medusa.auth?.getSession();
                const customerRes = await this.medusa.customers.retrieve();
                if (sessionRes?.customer != null
                    && sessionRes.response?.status === 200
                    && customerRes?.customer != null
                    && customerRes.response?.status === 200
                ) {
                    ctx.patchState({
                        isLoggedIn: true,
                        userEmail: sessionRes?.customer.email,
                        medusaId: customerRes?.customer.id,
                        hasSession: true,
                    });
                }
            }
        } catch (err: any) {
            if (err) {
                const state = ctx.getState();
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                ctx.patchState({
                    ...state,
                    hasSession: false,
                });
            }
        }
    }
    @Action(AuthStateActions.SetLoggedIn)
    authProviderCallback(ctx: StateContext<IAuthStateModel>, { isLoggedIn }: AuthStateActions.SetLoggedIn) {
        const state = ctx.getState();
        ctx.patchState({
            ...state,
            isLoggedIn,
        });
    }
    // @Action(AuthStateActions.SetUserId)
    // setUserId(ctx: StateContext<IAuthStateModel>, { userId }: AuthStateActions.SetUserId) {
    //     const state = ctx.getState();
    //     ctx.patchState(    //         ...state,
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
    async setTokenResponse(res: IResAuthRegister | IResAuthLogin): Promise<void> {
        try {
            if (res.jwt && res.user) {
                await this.tokenService.setToken(res.jwt);
            }
        } catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
}
