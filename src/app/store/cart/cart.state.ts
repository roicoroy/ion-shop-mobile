import { Inject, Injectable } from "@angular/core";
import Medusa from "@medusajs/medusa-js";
import { State, Store, Selector, Action, StateContext } from "@ngxs/store";
import { environment } from "src/environments/environment";
import { AddressesActions } from "../addresses/addresses.actions";
import { CartActions } from "./cart.actions";
import { IRegisterAddress } from "src/app/shared/types/types.interfaces";
import { ErrorLoggingActions } from "../error-logging/error-logging.actions";

export interface CartStateModel {
    cartId: string | any;
    cart: any | any;
    recentCompletedOrder: any | any;
    selectedRegion: string | any;
    selectedCountry: string | any;
    isGuest: boolean | any;
}

export const initStateModel: CartStateModel = {
    cartId: null,
    cart: null,
    recentCompletedOrder: null,
    selectedRegion: null,
    selectedCountry: null,
    isGuest: false,
};
@State({
    name: 'cart',
    defaults: initStateModel,
})
@Injectable()
export class CartState {
    medusaClient: any;

    constructor(
        private store: Store,
    ) {
        this.medusaClient = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }
    @Selector()
    static getCart(state: CartStateModel) {
        return state.cart;
    }
    @Selector()
    static getCartId(state: CartStateModel) {
        return state.cartId;
    }
    @Selector()
    static getRecentCompletedOrder(state: CartStateModel) {
        return state.recentCompletedOrder;
    }
    @Selector()
    static getIsGuest(state: CartStateModel) {
        return state.isGuest;
    }
    @Action(CartActions.GetMedusaCart)
    async getMedusaCart(ctx: StateContext<CartStateModel>, { cartId }: CartActions.GetMedusaCart) {
        try {
            let cart = await this.medusaClient.carts?.retrieve(cartId);
            ctx.patchState({
                cart: cart?.cart,
                cartId: cart?.cart.id,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));                console.log(err);
            }
        }
    }
    @Action(CartActions.CreateMedusaCart)
    async createMedusaCart(ctx: StateContext<CartStateModel>) {
        try {
            let cart = await this.medusaClient.carts.create();
            ctx.patchState({
                cart: cart?.cart,
                cartId: cart?.cart.id,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                console.log(err);
            }
        }
    }
    @Action(CartActions.CreateMedusaCartWithItems)
    async createMedusaCartWithItems(ctx: StateContext<CartStateModel>, { selectedVariant }: CartActions.CreateMedusaCartWithItems) {
        try {
            let cart = await this.medusaClient.carts.create();
            let cartWithItems = await this.medusaClient.carts.lineItems.create(cart.id, {
                variant_id: selectedVariant?.id,
                quantity: selectedVariant?.quantity,
            });
            ctx.patchState({
                cart: cartWithItems?.cart,
                cartId: cartWithItems?.cart.id,
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

            let regionRes = await this.medusaClient.carts.update(cartId, {
                region_id: region_id,
                country_code: editedCustomer?.country_code
            });

            let cartRes = await this.medusaClient.carts.update(cartId, {
                billing_address: editedCustomer,
                customer_id: regionRes.cart.customer_id,
            });
            ctx.patchState({
                cart: cartRes?.cart,
                cartId: cartRes?.cart.id,
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
            const region_id = await this.buildRegionCode(editedCustomer.country_code, regionList);
            let regionRes = await this.medusaClient.carts.update(cartId, {
                region_id: region_id,
                country_code: editedCustomer?.country_code
            });

            let cartRes = await this.medusaClient.carts.update(cartId, {
                shipping_address: editedCustomer,
                customer_id: regionRes.cart.customer_id,
            });
            ctx.patchState({
                cart: cartRes?.cart,
                cartId: cartRes?.cart.id,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CartActions.UpdateCartEmail)
    async updateCartEmail(ctx: StateContext<CartStateModel>, { cartId, email, isGuest }: CartActions.UpdateCartEmail) {
        try {
            let cartRes = await this.medusaClient.carts.update(cartId, {
                email: email,
            });
            console.log(cartRes);
            ctx.patchState({
                cart: cartRes?.cart,
                cartId: cartRes?.cart.id,
                isGuest
            });
            // this.store.dispatch(new CartActions.GetMedusaCart(cartId));
            // this.store.dispatch(new CustomerActions.GetSession());
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
                // region_code: customer.billing_address?.region_code,
                country_code: customer?.country_code,
                postal_code: customer?.postal_code,
                // region_id: cart2.region_id,
                phone: customer?.phone,
            };
            const regionList = await this.store.selectSnapshot<any>((state: any) => state.addresses?.regionList);
            console.log(regionList);

            const region_id = await this.buildRegionCode(editedCustomer.country_code, regionList);
            console.log(region_id);

            let regionRes = await this.medusaClient.carts.update(cartId, {
                region_id: region_id,
            });
            let cartRes = await this.medusaClient.carts.update(cartId, {
                billing_address: editedCustomer,
                shipping_address: editedCustomer,
                customer_id: regionRes.cart.customer_id,
            });
            ctx.patchState({
                cart: cartRes?.cart,
                cartId: cartRes?.cart.id,
            });
            // this.store.dispatch(new CartActions.GetMedusaCart(cartId));
            // this.store.dispatch(new CustomerActions.GetSession());
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
            let cart = await this.medusaClient.carts.lineItems.create(cartId, {
                variant_id: variantId,
                quantity: quantity
            });
            ctx.patchState({
                cart: cart?.cart,
                cartId: cart?.cart.id,
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
            let cart = await this.medusaClient.carts.lineItems.delete(cart_id, line_id);
            // this.store.dispatch(new UserActions.GetSession());
            ctx.patchState({
                cart: cart?.cart,
                cartId: cart?.cart.id,
            });
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
            let cart = await this.medusaClient.carts.create({
                region_id: regionId
            });
            // this.store.dispatch(new UserActions.GetSession());
            if (cart) {
                ctx.patchState({
                    cart: cart?.cart,
                    cartId: cart?.cart.id,
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
            let cart = await this.medusaClient.carts.update(cartId, {
                region_id: payload.region_id != null ? payload.region_id : null,
                country_code: payload?.country_code
            });
            this.store.dispatch(new CartActions.UpdateSelectedCountry(payload?.country_code))
            this.store.dispatch(new CartActions.UpdateSelectedRegion(payload.region_id))
        }
        catch (err: any) {
            if (err.response) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));            }
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
            const cart = await this.medusaClient.carts.complete(cartId);
            if (cart) {
                console.log('complete cart', cart);
                // this.store.dispatch(new UserActions.GetSession());
                ctx.patchState({
                    recentCompletedOrder: cart?.data,
                })
            }
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }

    @Action(CartActions.ClearIsGuest)
    async clearIsGuest(ctx: StateContext<CartStateModel>) {
        ctx.patchState({
            isGuest: false,
        });
    }

    @Action(CartActions.LogOut)
    async logout(ctx: StateContext<CartStateModel>) {
        ctx.setState({
            cartId: null,
            cart: null,
            recentCompletedOrder: null,
            selectedRegion: null,
            selectedCountry: null,
            isGuest: false,
        });
    }
}
