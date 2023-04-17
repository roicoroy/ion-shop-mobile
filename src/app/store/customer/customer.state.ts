import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import Medusa from "@medusajs/medusa-js";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerActions } from './customer.actions';
import { ICustomerRegisterData } from 'projects/types/types.interfaces';
import { Observable } from 'rxjs';
import { ErrorLoggingActions } from '../error-logging/error-logging.actions';

export class CustomerStateModel {
    customer: any | any;
    isLoggedIn: boolean | any;
    session: any | any;
}

@State<CustomerStateModel>({
    name: 'customer',
    defaults: {
        customer: null,
        isLoggedIn: null,
        session: null
    }
})
@Injectable()
export class CustomerState {
    medusaClient: any;

    headers_json = new HttpHeaders().set('Content-Type', 'application/json');
    headers_cookie = new HttpHeaders().set('Cookie', 'connect.sid={sid}');
    headers_token = new HttpHeaders().set('Authorization', 'Bearer supersecret2');

    constructor(
        private store: Store,
        private http: HttpClient
    ) {
        this.medusaClient = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }

    @Selector()
    static isLoggedIn(state: CustomerStateModel) {
        return state.isLoggedIn;
    }
    @Selector()
    static getCustomer(state: CustomerStateModel) {
        return state.customer;
    }
    @Selector()
    static getSession(state: CustomerStateModel): Observable<any> {
        return state.session;
    }
    @Action(CustomerActions.Login)
    async medusaLogin(ctx: StateContext<CustomerStateModel>, { payload }: CustomerActions.Login) {
        const loginReq = {
            email: payload.email,
            password: payload.password,
        };
        try {
            let response = await this.medusaClient.auth?.authenticate(loginReq);
            // console.log(response);
            // if (response?.customer != null && response?.status === 200)
            if (response) {
                ctx.patchState({
                    customer: response?.customer,
                    isLoggedIn: true,
                });
                // this.store.dispatch(new CustomerActions.GetSession());
            }
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                ctx.patchState({
                    isLoggedIn: false,
                });
            }
        }
    }

    @Action(CustomerActions.Register)
    async medusaRegister(ctx: StateContext<CustomerStateModel>, { payload }: CustomerActions.Register) {
        // console.log(payload);
        const registerRequest: ICustomerRegisterData = {
            first_name: payload?.first_name,
            last_name: payload?.last_name,
            email: payload?.email,
            password: payload?.password,
            phone: payload?.phone,
        };
        try {
            let response = await this.medusaClient.customers?.create(registerRequest);
            if (response?.customer != null && response?.status === 200) {
                this.store.dispatch(new CustomerActions.GetSession())
            }
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                ctx.patchState({
                    isLoggedIn: false,
                });
            }
        }
    }

    @Action(CustomerActions.GetSession)
    async getSession(ctx: StateContext<CustomerStateModel>) {
        try {
            let sessionRes = await this.medusaClient.auth?.getSession();
            let customerRes = await this.medusaClient.customers.retrieve();
            // console.log('sessionRes');
            // console.log(customerRes);
            if (sessionRes?.customer != null && sessionRes.response?.status === 200 && customerRes?.customer != null && customerRes.response?.status === 200) {
                ctx.patchState({
                    session: sessionRes?.customer ? sessionRes?.customer : null,
                    customer: customerRes?.customer ? customerRes?.customer : null,
                    isLoggedIn: true,
                });
            }
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }

    @Action(CustomerActions.AddAShippingAddress)
    async addaShippingAddress(ctx: StateContext<CustomerStateModel>, { payload }: CustomerActions.AddAShippingAddress) {
        try {

            // let sessionRes = await this.medusaClient.auth?.getSession();
            // if (sessionRes.response.status === 200) {
            let customer = await this.medusaClient.customers.addresses.addAddress({
                address: {
                    first_name: payload?.first_name,
                    last_name: payload?.last_name,
                    address_1: payload?.address_1,
                    city: payload?.city,
                    country_code: payload?.country_code,
                    postal_code: payload?.postal_code,
                    phone: payload?.phone,
                    address_2: payload?.address_2,
                    province: 'Georgia',
                    company: 'Wyman LLC',
                    metadata: {}
                }
            });
            this.store.dispatch(new CustomerActions.GetSession());
            // }
        }
        catch (err: any) {
            if (err) {
                // this.store.dispatch(new LogErrorEntry(err));
                // const erro: any = {
                //     message: 'you need to login'
                // }
                // this.store.dispatch(new LogErrorEntry(erro));
            }
        }
    }
    @Action(CustomerActions.UpdateCustomerAddress)
    async updateCustomerAddress(ctx: StateContext<CustomerStateModel>, { addressId, payload }: CustomerActions.UpdateCustomerAddress) {
        try {
            this.store.dispatch(new CustomerActions.GetSession());

            let customer = await this.medusaClient.customers.addresses.updateAddress(addressId, {
                first_name: payload?.first_name,
                last_name: payload?.last_name,
                address_1: payload?.address_1,
                address_2: payload?.address_2,
                city: payload?.city,
                country_code: payload?.country_code,
                postal_code: payload?.postal_code,
                phone: payload?.phone,
            });

            this.store.dispatch(new CustomerActions.GetSession());
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CustomerActions.DeleteCustomerAddress)
    async deleteCustomerAddress(ctx: StateContext<CustomerStateModel>, { addressId }: CustomerActions.DeleteCustomerAddress) {
        try {

            let customer = await this.medusaClient.customers.addresses.deleteAddress(addressId);
            this.store.dispatch(new CustomerActions.GetSession());
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }

    @Action(CustomerActions.AddCustomerToCart)
    async updateCart(ctx: StateContext<CustomerStateModel>, { customerId }: CustomerActions.AddCustomerToCart) {
        try {
            const cart = await this.store.selectSnapshot<any>((state: any) => state.cart?.cart);
            let cartRes = await this.medusaClient.carts.update(cart?.id, {
                customer_id: customerId,
            });
            console.log(cartRes);
            ;
            this.store.dispatch(new CustomerActions.GetSession());
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }

    @Action(CustomerActions.LogOutMedusaUser)
    async LogOutMedusaUser(ctx: StateContext<CustomerStateModel>) {
        return ctx.patchState({
            customer: null,
            isLoggedIn: false,
            session: null
        });
    }
}
