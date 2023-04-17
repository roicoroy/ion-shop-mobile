import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { NavigationService } from './navigation.service';
import Medusa from "@medusajs/medusa-js";
import { AuthStateActions } from 'src/app/store/auth/auth.actions';
@Injectable({
    providedIn: 'root'
})
export class AppAuthService {
    headers_json = new HttpHeaders().set('Content-Type', 'application/json');
    medusaClient: any;
    constructor(
        private store: Store,
        private navigation: NavigationService,
        private http: HttpClient
    ) {
        this.medusaClient = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
     }
    public async logout(): Promise<void> {
        this.store.dispatch(new AuthStateActions.AuthStateLogout());
        let sessionRes = await this.medusaClient.auth?.deleteSession();
    }
    public async logoutUser(): Promise<void> {
        this.store.dispatch(new AuthStateActions.AuthStateLogout());
        let sessionRes = await this.medusaClient.auth?.deleteSession();
    }
}
