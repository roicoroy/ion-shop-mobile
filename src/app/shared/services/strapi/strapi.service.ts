import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Injectable({
    providedIn: 'root'
})
export class StrapiService {
    headers = new HttpHeaders().set('Content-Type', 'application/json');
    strapiUser: any;

    constructor(
        private httpClient: HttpClient,
        public alertCtrl: AlertController,
    ) { }
    async loginStrapiAuth0Browser() {
        const url = `${environment.BASE_PATH}/api/connect/${'auth0'}`;
        console.log(url);
        await Browser.open({ url, windowName: '_self' });
    }
    strapiAuth0Callback(params: string, provider: string): Observable<any> {
        return this.httpClient.get(environment.BASE_PATH + '/api/auth/' + provider + '/callback?id_token=' + params);
    }
    loginPasswordless(values: any) {
        const data = {
            username: values.username,
            email: values.email,
        }
        return this.httpClient.post(environment.BASE_PATH + '/api/strapi-plugin-passwordless/send-link', values, { headers: this.headers });
    }
    passwordlessCallback(token: string) {
        return this.httpClient.get(`${environment.BASE_PATH}/api/strapi-plugin-passwordless/login?loginToken=${token}`, { headers: this.headers });
    }
    loginStrapiAuth0Http(provider: string): Observable<any> {
        return this.httpClient.get(`${environment.BASE_PATH}/api/connect/${provider}`, { headers: this.headers })
    }
    login(email: string, password: string): any {
        const data = {
            identifier: email,
            password
        }
        return this.httpClient.post(environment.BASE_PATH + '/api/auth/local', data, { headers: this.headers });
    }
}
