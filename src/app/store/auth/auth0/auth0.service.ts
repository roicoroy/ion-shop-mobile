import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BrowserCheckService } from "projects/strapi-auth/src/lib/services/browser-check/browser-check.service";
import { StrapiAuthConfig, TokenService, StrapiAuthProviders, IResAuthRegister, IResAuthLogin } from "projects/strapi-auth/src/public-api";
import { tap } from "rxjs";
import { Browser } from '@capacitor/browser';
import { environment } from "src/environments/environment";
import { Store } from "@ngxs/store";
import { AuthStateActions } from "../auth.actions";

@Injectable({
    providedIn: 'root'
})
export class Auth0Service {
    private apiUrl: string;
    public isAuthenticated: boolean;

    public readonly strapiAuthConfig: StrapiAuthConfig;

    constructor(
        private httpClient: HttpClient,
        private store: Store,
        private tokenService: TokenService,
        private browserCheck: BrowserCheckService,
    ) {
        if (this.browserCheck.isServer) {
            return;
        }

        this.apiUrl = environment.BASE_PATH;

        const token = this.tokenService.getToken();
        if (token) {
            this.isAuthenticated = true;
            this.store.dispatch(new AuthStateActions.SetLoggedIn(true))
        }
    }
    /**
     * Login user using external provider
     * Auth0
     */
    async loginStrapiAuth0() {
        const url = `${this.apiUrl}/api/connect/${'auth0'}`;
        await Browser.open({ url, windowName: '_self' });
    }
    /**
     * Login user using external provider
     * like google / facebook / microsoft / github
     */
    public callbackProviderLogin(params: string, provider: StrapiAuthProviders) {
        return this.httpClient.get(this.apiUrl + '/api/auth/' + provider + '/callback' + params)
            .pipe(
                tap((res: any) => {
                    console.log(res);
                    if (res) {
                        this.setTokenResponse(res);
                    }
                })
            );
    }
    /**
     * Write token to store and
     * call auth state subject
     */
    private setTokenResponse(res: IResAuthRegister | IResAuthLogin): void {
        if (res.jwt && res.user) {
            this.isAuthenticated = true;

            this.tokenService.setToken(res.jwt);
            this.store.dispatch(new AuthStateActions.SetLoggedIn(true))
        }
    }
}
