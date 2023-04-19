import { StrapiAuthProviders } from "projects/strapi-auth/src/public-api";

export namespace Auth0Actions {
    export class Auth0ProviderCallback {
        static readonly type = '[Auth0Actions] Auth0 Provider Callback';
        constructor(public token: string, public provider: StrapiAuthProviders) { }
    }
}
