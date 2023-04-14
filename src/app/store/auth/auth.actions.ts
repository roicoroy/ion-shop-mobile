import { IUser, StrapiAuthProviders } from "projects/strapi-auth/src/public-api";

export namespace AuthStateActions {
    // export class AuthProviderCallback {
    //     static readonly type = '[AuthActions] Auth Provider Callback';
    //     constructor(public token: string, public provider: StrapiAuthProviders) { }
    // }
    export class SetLoggedIn {
        static readonly type = '[AuthActions] Set Logged In';
        constructor(public isLoggedIn: boolean) { }
    }
    export class SetUser {
        static readonly type = '[AuthActions] Set User';
        constructor(public user: IUser) { }
    }
}
