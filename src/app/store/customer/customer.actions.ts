import { ICustomerLoginData, ICustomerRegisterData, IRegisterAddress } from "../../../../projects/types/types.interfaces";

export namespace CustomerActions {

    export class Login {
        static readonly type = '[CustomerActions] Login Medusa user and set on state';
        constructor(public payload: ICustomerLoginData) { }
    }
    export class Register {
        static readonly type = '[CustomerActions] Register Medusa user and set on state';
        constructor(public payload: ICustomerRegisterData) { }
    }
    export class GetSession {
        static readonly type = '[CustomerActions] Get Medusa Session';
    }
    export class AddAShippingAddress {
        static readonly type = '[CustomerActions] Add a Shipping Address to customer';
        constructor(public payload: IRegisterAddress | any) { }
    }
    export class UpdateCustomerAddress {
        static readonly type = '[CustomerActions] Update Customer Address';
        constructor(public addressId: string, public payload: IRegisterAddress) { }
    }
    export class DeleteCustomerAddress {
        static readonly type = '[CustomerActions] Delete Customer Address';
        constructor(public addressId: string) { }
    }
    export class AddCustomerToCart {
        static readonly type = '[CustomerActions] Add Customer To Cart';
        constructor(public customerId: string) { }
    }
    export class LogOutMedusaUser {
        static readonly type = '[CustomerActions] Logout Medusa clear state User';
    }
}
