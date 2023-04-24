import { Inject, Injectable } from "@angular/core";
import Medusa from "@medusajs/medusa-js";
import { State, Store, Selector, Action, StateContext } from "@ngxs/store";
import { environment } from "src/environments/environment";
import { AddressesActions } from "../addresses/addresses.actions";
import { CartActions } from "./cart.actions";
import { ICustomerLoginData, ICustomerRegisterData, IRegisterAddress } from "src/app/shared/types/types.interfaces";
import { ErrorLoggingActions } from "../error-logging/error-logging.actions";
import { AuthStateActions } from "../auth/auth.actions";

export interface CartStateModel {
    recentCompletedOrder: any;
    selectedRegion: string;
    selectedCountry: string;
    cart: any;
}

export const initStateModel: CartStateModel = {
    recentCompletedOrder: null,
    selectedRegion: null,
    selectedCountry: null,
    cart: null,
};
@State({
    name: 'cart',
    defaults: initStateModel,
})
@Injectable()
export class CartState {
    medusa: any;

    constructor(
        private store: Store,
    ) {
        this.medusa = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }
    @Selector()
    static getRecentCompletedOrder(state: CartStateModel) {
        return state.recentCompletedOrder;
    }
    @Selector()
    static getCart(state: CartStateModel) {
        return state.cart;
    }
    @Selector()
    static getCartId(state: CartStateModel): string {
        return state.cart.id;
    }
    @Action(CartActions.GetMedusaCart)
    async getMedusaCart(ctx: StateContext<CartStateModel>, { cartId }: CartActions.GetMedusaCart) {
        try {
            let cart = await this.medusa.carts?.retrieve(cartId);
            ctx.patchState({
                cart: cart?.cart,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err)); console.log(err);
            }
        }
    }
    @Action(CartActions.CreateMedusaCart)
    async createMedusaCart(ctx: StateContext<CartStateModel>) {
        try {
            const savedCart = await this.store.selectSnapshot<any>((state: any) => state.cart?.cart);
            if (savedCart != null) { return }
            const savedEmail = await this.store.selectSnapshot<any>((state: any) => state.authState?.userEmail);
            if (savedEmail) {
                const customerId = await this.medusaUserInit(savedEmail);
                if (customerId) {
                    const cart = await this.medusa.carts.create();
                    ctx.patchState({
                        cart: cart?.cart,
                    });
                }
            }
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                console.log(err);
            }
        }
    }
    /**
     * Creates a Cart within the given region and with the initial items. 
     * If no region_id is provided the cart will be associated with the first Region available. 
     * If no items are provided the cart will be empty after creation. 
     * If a user is logged in the cart's customer id and email will be set.
     */
    // async medusaCartInit(email: string): Promise<string> {
    //     const customerId = await this.medusaUserInit(email);
    //     let cartId = this.medusa.cart;
    //     console.log(customerId);
    //     if (customerId) {
    //         cartId = await this.medusa.cart;
    //         console.log(cartId);
    //         return cartId;
    //     }
    //     return cartId;

    // }
    async medusaUserInit(email: string) {
        if (email === null) { return; }
        try {
            const medusaEmailExist = await this.medusa.auth.exists(email);
            if (medusaEmailExist.exists && email !== null) {
                const loginReq: ICustomerLoginData = {
                    email: email,
                    password: email,
                };
                let loggedInCustomer = await this.medusa.auth?.authenticate(loginReq);
                return loggedInCustomer.customer.id;
            }
            else if (!medusaEmailExist.exists && email) {
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
    @Action(CartActions.CreateMedusaCartWithItems)
    async createMedusaCartWithItems(ctx: StateContext<CartStateModel>, { selectedVariant }: CartActions.CreateMedusaCartWithItems) {
        try {
            let cart = await this.medusa.carts.create();
            let cartWithItems = await this.medusa.carts.lineItems.create(cart.id, {
                variant_id: selectedVariant?.id,
                quantity: selectedVariant?.quantity,
            });
            ctx.patchState({
                cart: cartWithItems?.cart,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }

    }
    @Action(CartActions.UpdateCartBillingAddress)
    async updateCartBillingAddress(ctx: StateContext<CartStateModel>, { cartId, address }: CartActions.UpdateCartBillingAddress) {
        try {
            console.log(cartId, address);
            const editedCustomer: IRegisterAddress = {
                first_name: address?.first_name,
                last_name: address?.last_name,
                address_1: address?.address_1,
                address_2: address?.address_2,
                city: address?.city,
                country_code: address?.country_code,
                postal_code: address?.postal_code,
                phone: address?.phone,
            };
            this.store.dispatch(new AddressesActions.GetRegionList());
            const regionList = await this.store.selectSnapshot<any>((state: any) => state.addresses?.regionList);
            const region_id = await this.buildRegionCode(editedCustomer.country_code, regionList);
            let regionRes = await this.medusa.carts.update(cartId, {
                region_id: region_id,
                country_code: editedCustomer?.country_code
            });
            let cartRes = await this.medusa.carts.update(cartId, {
                billing_address: editedCustomer,
                customer_id: regionRes.cart.customer_id,
            });
            ctx.patchState({
                cart: cartRes?.cart,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CartActions.UpdateCartShippingAddress)
    async updateCartShippingAddress(ctx: StateContext<CartStateModel>, { cartId, address }: CartActions.UpdateCartShippingAddress) {
        try {
            // console.log(cartId, address);
            const editedCustomer: IRegisterAddress = {
                first_name: address?.first_name,
                last_name: address?.last_name,
                address_1: address?.address_1,
                address_2: address?.address_2,
                city: address?.city,
                country_code: address?.country_code,
                postal_code: address?.postal_code,
                phone: address?.phone,
            };
            const regionList = await this.store.selectSnapshot<any>((state: any) => state.addresses?.regionList);
            const regionId = await this.buildRegionCode(editedCustomer.country_code, regionList);
            // console.log(regionList, regionId);
            let regionRes = await this.medusa.carts.update(cartId, {
                region_id: regionId,
                country_code: editedCustomer?.country_code
            });
            let cart = await this.medusa.carts.update(cartId, {
                shipping_address: editedCustomer,
                customer_id: regionRes.cart.customer_id,
            });
            ctx.patchState({
                cart: cart?.cart,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CartActions.UpdateCart)
    async updateCart(ctx: StateContext<CartStateModel>, { cartId, customer }: CartActions.UpdateCart) {
        try {
            const editedCustomer: IRegisterAddress = {
                first_name: customer?.first_name,
                last_name: customer?.last_name,
                address_1: customer?.address_1,
                address_2: customer?.address_2,
                city: customer?.city,
                country_code: customer?.country_code,
                postal_code: customer?.postal_code,
                phone: customer?.phone,
            };
            const regionList = await this.store.selectSnapshot<any>((state: any) => state.addresses?.regionList);
            console.log(regionList);

            const region_id = await this.buildRegionCode(editedCustomer.country_code, regionList);
            console.log(region_id);

            let regionRes = await this.medusa.carts.update(cartId, {
                region_id: region_id,
            });
            let cartRes = await this.medusa.carts.update(cartId, {
                billing_address: editedCustomer,
                shipping_address: editedCustomer,
                customer_id: regionRes.cart.customer_id,
            });
            ctx.patchState({
                cart: cartRes?.cart,
            });
            this.store.dispatch(new CartActions.GetMedusaCart(cartId));
            this.store.dispatch(new AuthStateActions.getMedusaSession());
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    async buildRegionCode(country_code: string, regionList: [] = []): Promise<string> {
        const countries = regionList.map((region: any, i: any) => region.countries);
        const result = [].concat(...countries);
        const filtered: any = result.filter((region: any) => {
            return region.iso_2 === country_code;
        });
        return filtered[0]?.region_id;
    }
    @Action(CartActions.AddProductMedusaToCart)
    async addProductMedusaToCart(ctx: StateContext<CartStateModel>, { cartId, quantity, variantId }: CartActions.AddProductMedusaToCart) {
        try {
            let cart = await this.medusa.carts.lineItems.create(cartId, {
                variant_id: variantId,
                quantity: quantity
            });
            ctx.patchState({
                cart: cart?.cart,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }

    }
    @Action(CartActions.DeleteProductMedusaFromCart)
    async deleteProductMedusaFromCart(ctx: StateContext<CartStateModel>, { cart_id, line_id }: CartActions.DeleteProductMedusaFromCart) {
        try {
            let cart = await this.medusa.carts.lineItems.delete(cart_id, line_id);
            ctx.patchState({
                cart: cart?.cart,
            });
            this.store.dispatch(new AuthStateActions.getMedusaSession());
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CartActions.CreateCartWithRegionId)
    async createCartWithRegionId(ctx: StateContext<CartStateModel>, { regionId }: CartActions.CreateCartWithRegionId) {
        try {
            let cart = await this.medusa.carts.create({
                region_id: regionId
            });
            // this.store.dispatch(new UserActions.GetSession());
            if (cart) {
                ctx.patchState({
                    cart: cart?.cart,
                });
            }
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CartActions.UpdateRegionCountryCart)
    async updateRegionCountryCart(ctx: StateContext<CartStateModel>, { cartId, payload }: CartActions.UpdateRegionCountryCart) {
        try {
            let cart = await this.medusa.carts.update(cartId, {
                region_id: payload.region_id != null ? payload.region_id : null,
                country_code: payload?.country_code
            });
            this.store.dispatch(new CartActions.UpdateSelectedCountry(payload?.country_code))
            this.store.dispatch(new CartActions.UpdateSelectedRegion(payload.region_id))
        }
        catch (err: any) {
            if (err.response) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CartActions.UpdateSelectedRegion)
    async updateselectedRegion(ctx: StateContext<CartStateModel>, { selectedRegion }: CartActions.UpdateSelectedRegion) {
        // console.log(selectedRegion);
        try {
            ctx.patchState({
                selectedRegion: selectedRegion,
            });
        }
        catch (err: any) {
            if (err.response) {
            }
        }
    }
    @Action(CartActions.UpdateSelectedCountry)
    async updateSelectedCountry(ctx: StateContext<CartStateModel>, { selectedCountry }: CartActions.UpdateSelectedCountry) {
        // console.log(selectedCountry);
        try {
            ctx.patchState({
                selectedCountry: selectedCountry,
            });
        }
        catch (err: any) {
            if (err.response) {
            }
        }
    }
    @Action(CartActions.CompleteCart)
    async completeCart(ctx: StateContext<CartStateModel>, { cartId }: CartActions.CompleteCart) {
        try {
            const cart = await this.medusa.carts.complete(cartId);
            ctx.patchState({
                recentCompletedOrder: cart?.data ? cart?.data : null,
            })
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CartActions.LogOut)
    async logout(ctx: StateContext<CartStateModel>) {
        ctx.setState({
            cart: null,
            recentCompletedOrder: null,
            selectedRegion: null,
            selectedCountry: null,
        });
    }
}
