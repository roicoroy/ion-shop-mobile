import { IRegisterAddress } from "src/app/shared/types/types.interfaces";

export namespace CustomerActions {
    export class AddAShippingAddress {
        static readonly type = '[CustomerActions] Add a Shipping Address to customer';
        constructor(public payload: IRegisterAddress) { }
    }
    export class UpdateCustomerAddress {
        static readonly type = '[CustomerActions] Update Customer Address';
        constructor(public addressId: string, public payload: IRegisterAddress) { }
    }
    export class DeleteCustomerAddress {
        static readonly type = '[CustomerActions] Delete Customer Address';
        constructor(public addressId: string) { }
    }
}
