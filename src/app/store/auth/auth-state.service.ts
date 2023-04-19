import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BrowserCheckService } from "projects/strapi-auth/src/lib/services/browser-check/browser-check.service";
import { StrapiAuthConfig, TokenService, StrapiAuthProviders, IResAuthRegister, IResAuthLogin } from "projects/strapi-auth/src/public-api";
import { Observable, tap } from "rxjs";
import { Browser } from '@capacitor/browser';
import { environment } from "src/environments/environment";
import { Store } from "@ngxs/store";
import { AuthStateActions } from "./auth.actions";

@Injectable({
    providedIn: 'root'
})
export class AuthStateService {
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private httpClient: HttpClient,
    ) { }

    async loginStrapiAuth0() {
        const url = `${environment.BASE_PATH}/api/connect/${'auth0'}`;
        await Browser.open({ url, windowName: '_self' });
    }
    callbackProviderLogin(params: string, provider: StrapiAuthProviders) {
        return this.httpClient.get(environment.BASE_PATH + '/api/auth/' + provider + '/callback' + params);
    }
    medusaLogout() {
        return this.httpClient.delete(environment.MEDUSA_API_BASE_PATH + '/store/auth/', { headers: this.headers });
    }
    retrieveMedusaCustomer() {
        return this.httpClient.get(environment.MEDUSA_API_BASE_PATH + '/store/auth/');
    }
    public loadUser(userId: string) {
        return this.httpClient.get(environment.BASE_PATH + '/api/users/' + userId + '?populate=*', { headers: this.headers })
    }
}
