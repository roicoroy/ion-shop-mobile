import { HttpClient, HttpBackend } from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { BrowserCheckService } from "projects/strapi-auth/src/lib/services/browser-check/browser-check.service";
import { ConfigServiceInjector } from "projects/strapi-auth/src/lib/services/config/config.service";
import { IUser, StrapiAuthConfig, TokenService, ConfigService, StrapiAuthProviders, IResAuthRegister, IResAuthLogin } from "projects/strapi-auth/src/public-api";
import { Subject, lastValueFrom, tap } from "rxjs";
import { Browser } from '@capacitor/browser';
import { environment } from "src/environments/environment";
import { Store } from "@ngxs/store";
import { AuthStateActions } from "../auth.actions";

@Injectable({
    providedIn: 'root'
})
export class Auth0Service {
    private apiUrl: string;
    private user: IUser;
    private authHttpClient: HttpClient;

    // private authState: Subject<void> = new Subject();
    // private userState: Subject<void> = new Subject();

    public isAuthenticated: boolean;

    public readonly strapiAuthConfig: StrapiAuthConfig;

    // TODO: Add error handling for login and register post
    // TODO: Cleanup AuthService

    constructor(
        private httpClient: HttpClient,
        private handler: HttpBackend,
        private router: Router,
        private store: Store,
        private tokenService: TokenService,
        private browserCheck: BrowserCheckService,
        // @Inject(ConfigServiceInjector) private config: StrapiAuthConfig
    ) {
        if (this.browserCheck.isServer) {
            return;
        }

        // this.strapiAuthConfig = config;

        this.apiUrl = environment.BASE_PATH;

        // Requests wont get intercepted
        this.authHttpClient = new HttpClient(handler);

        const token = this.tokenService.getToken();
        if (token) {
            this.isAuthenticated = true;
            this.store.dispatch(new AuthStateActions.SetLoggedIn(true))
        }
    }
    async loginStrapiAuth0() {
        const url = `${this.apiUrl}/api/connect/${'auth0'}`;
        await Browser.open({ url, windowName: '_self' });
    }
    /**
     * Login user using external provider
     * like google / facebook / microsoft / github
     */
    public callbackProviderLogin(params: string, provider: StrapiAuthProviders) {
        return this.authHttpClient.get(this.apiUrl + '/api/auth/' + provider + '/callback' + params)
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
            this.user = res.user as IUser;
            this.isAuthenticated = true;

            this.tokenService.setToken(res.jwt);
            this.store.dispatch(new AuthStateActions.SetLoggedIn(true))
        }
    }
}
