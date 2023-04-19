import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import Medusa from "@medusajs/medusa-js";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerActions } from './customer.actions';
import { ErrorLoggingActions } from '../error-logging/error-logging.actions';
import { AuthStateActions } from '../auth/auth.actions';

export class CustomerStateModel {
    customer: any;
}

@State<CustomerStateModel>({
    name: 'customer',
    // defaults: {
    //     customer: null,
    // },
})
@Injectable()
export class CustomerState {

    medusaClient: any;

    headers_json = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private store: Store,
    ) {
        this.medusaClient = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }
    @Action(CustomerActions.AddAShippingAddress)
    async addaShippingAddress(ctx: StateContext<CustomerStateModel>, { payload }: CustomerActions.AddAShippingAddress) {
        try {
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
            this.store.dispatch(new AuthStateActions.getMedusaSession());
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CustomerActions.UpdateCustomerAddress)
    async updateCustomerAddress(ctx: StateContext<CustomerStateModel>, { addressId, payload }: CustomerActions.UpdateCustomerAddress) {
        try {
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
            this.store.dispatch(new AuthStateActions.getMedusaSession());
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
            this.store.dispatch(new AuthStateActions.getMedusaSession());
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    // @Action(CustomerActions.AddCustomerToCart)
    // async updateCart(ctx: StateContext<CustomerStateModel>, { customerId }: CustomerActions.AddCustomerToCart) {
    //     try {
    //         const cart = await this.store.selectSnapshot<any>((state: any) => state.cart?.cart);
    //         let cartRes = await this.medusaClient.carts.update(cart?.id, {
    //             customer_id: customerId,
    //         });
    //         console.log(cartRes);
    //         ;
    //     }
    //     catch (err: any) {
    //         if (err) {
    //             this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
    //         }
    //     }
    // }
}
