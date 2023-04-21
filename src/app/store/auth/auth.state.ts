import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { AuthStateActions } from './auth.actions';
import Medusa from "@medusajs/medusa-js";
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { StrapiService } from 'src/app/shared/services/strapi/strapi.service';
import { IResAuthLogin } from 'src/app/shared/types/responses/ResAuthLogin';
import { IResAuthRegister } from 'src/app/shared/types/responses/ResAuthRegister';
import { ICustomerLoginData, ICustomerRegisterData } from 'src/app/shared/types/types.interfaces';
import { ErrorLoggingActions } from '../error-logging/error-logging.actions';
import { AuthStateService } from './auth-state.service';
import { StateClear } from 'ngxs-reset-plugin';

export class IAuthStateModel {
    isLoggedIn: boolean;
    userId: string;
    user: any;
    customer: any;
    session: any;
    userEmail: string;
    medusaId: string;
    hasSession: boolean;
}
@State<IAuthStateModel>({
    name: 'authState',
    defaults: {
        isLoggedIn: null,
        userId: null,
        user: null,
        customer: null,
        session: null,
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
        private dataService: StrapiService,
    ) {
        this.medusa = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }
    @Selector()
    static getCustomer(state: IAuthStateModel) {
        return state.customer;
    }
    @Selector()
    static getSession(state: IAuthStateModel) {
        return state.session;
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
    @Selector()
    static getUser(state: IAuthStateModel) {
        return state.user;
    }
    @Action(AuthStateActions.UpdateStrapiUser)
    updateStrapiUser({ getState, patchState }: StateContext<IAuthStateModel>, { userId, profileForm }: AuthStateActions.UpdateStrapiUser) {
        const state = getState();
    }
    @Action(AuthStateActions.SetAuthState)
    async setAuthState(ctx: StateContext<IAuthStateModel>, { user }: AuthStateActions.SetAuthState) {
        const state = ctx.getState();
        try {
            if (user.jwt && user.user) {
                console.log('zzzz',user)

                this.setTokenResponse(user);
                const medusaCustomerID = await this.medusaCartInit(user.user.email);
                if (medusaCustomerID) {
                    this.authService.loadUser(user.user.id)
                        .subscribe((user: any) => {
                            ctx.patchState({
                                ...state,
                                isLoggedIn: true,
                                userEmail: user.email,
                                userId: user?.id,
                                user: user,
                                medusaId: medusaCustomerID,
                                hasSession: true,
                            });
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
    @Action(AuthStateActions.SetUploadedUser)
    setUploadedUser({ getState, patchState }: StateContext<IAuthStateModel>, { userId }: AuthStateActions.SetUploadedUser) {
        const state = getState();
        console.log("payload", userId);
        if (userId !== null) {
            this.authService.loadUser(userId)
                .subscribe((user: any) => {
                    console.log("result", user);
                    patchState({
                        ...state,
                        user: user.user,
                        isLoggedIn: true
                    });
                });
        };
    }
    @Action(AuthStateActions.GetCustomer)
    async getCustomer(ctx: StateContext<IAuthStateModel>, { }: AuthStateActions.GetCustomer) {
        try {
            const state = ctx.getState();
            const userEmail = await this.store.selectSnapshot<any>((state: any) => state.authState?.userEmail);
            const customer = await this.buildCustomerObj(userEmail);
            let session = await this.medusa.auth?.getSession();
            ctx.patchState({
                ...state,
                isLoggedIn: true,
                customer: customer,
                session: session.customer,
                hasSession: true,
            });
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
                        customer: customerRes.customer,
                        session: sessionRes.customer,
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
    async authProviderCallback(ctx: StateContext<IAuthStateModel>, { isLoggedIn }: AuthStateActions.SetLoggedIn) {
        const state = ctx.getState();
        const userId = await this.store.selectSnapshot<any>((state: any) => state.authState?.userId);
        if (userId !== null) {
            this.authService.loadUser(userId)
                .subscribe((user: any) => {
                    ctx.patchState({
                        ...state,
                        user: user,
                        isLoggedIn: true
                    });
                });
        };
    }

    @Action(AuthStateActions.AuthStateLogout)
    authStateLogout(ctx: StateContext<IAuthStateModel>, { }: AuthStateActions.AuthStateLogout) {
        this.authService.medusaLogout();
        this.tokenService.deleteToken();
        this.store.dispatch(new StateClear());
        
        return ctx.setState({
            isLoggedIn: null,
            userId: null,
            customer: null,
            user: null,
            session: null,
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
    async medusaCartInit(email: string) {
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
    async buildCustomerObj(email: string) {
        try {
            const medusaEmailExist = await this.medusa.auth.exists(email);
            if (medusaEmailExist.exists) {
                const loginReq: ICustomerLoginData = {
                    email: email,
                    password: email,
                };
                let loggedInCustomer = await this.medusa.auth?.authenticate(loginReq);
                return loggedInCustomer.customer;
            }
            else {
                const registerRequest: ICustomerRegisterData = {
                    email: email,
                    password: email,
                };
                let registeredCustomer = await this.medusa.customers?.create(registerRequest);
                return registeredCustomer.customer;
            }
        } catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
}
