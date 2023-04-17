import { IResAuthLogin, IResAuthRegister, IUser, StrapiAuthProviders } from "projects/strapi-auth/src/public-api";
import { ICustomerLoginData, ICustomerRegisterData } from "projects/types/types.interfaces";

export namespace AuthStateActions {
    // export class CustomerLogin {
    //     static readonly type = '[AuthStateActions] Login Medusa user and set on state';
    //     constructor(public payload: ICustomerLoginData) { }
    // }
    export class CreateMedusaCustomer {
        static readonly type = '[CreateMedusaCustomer] Create Medusa Customer';
        constructor(public email: string, public password: string) { }
    }
    export class getMedusaSession {
        static readonly type = '[AuthStateActions] Get Medusa Session';
    }
    export class SetAuthState {
        static readonly type = '[AuthStateActions] Auth State';
        constructor(public user: IResAuthRegister | IResAuthLogin) { }
        // userEmail: string, public userId: string
    }
    export class SetLoggedIn {
        static readonly type = '[AuthStateActions] Set Logged In';
        constructor(public isLoggedIn: boolean) { }
    }
    export class SetUserEmail {
        static readonly type = '[AuthStateActions] Set User Email';
        constructor(public userEmail: string) { }
    }
    export class SetUserId {
        static readonly type = '[AuthStateActions] Set User Id';
        constructor(public userId: string) { }
    }
    export class AuthStateLogout {
        static readonly type = '[AuthStateActions] Auth State Logout';
    }
}
