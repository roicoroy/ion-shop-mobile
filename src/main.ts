import { LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxStripeModule } from 'ngx-stripe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import { AuthInterceptor, StrapiAuthConfig, StrapiAuthModule } from 'projects/strapi-auth/src/public-api';
import { AuthState } from './app/store/auth/auth.state';
import { Auth0State } from './app/store/auth/auth0/auth0.state';

registerLocaleData(localeEn, 'en');
registerLocaleData(localePt, 'pt');

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

// StrapiAuthConfig
const strapiAuthConfig: StrapiAuthConfig = {
  strapi_base_url: 'http://localhost:1337/api',
  routes: {
    logoutRedirect: '/home'
  }
};

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'en' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    importProvidersFrom(
      IonicModule.forRoot({}),
      HttpClientModule,
      StrapiAuthModule.forRoot(strapiAuthConfig),
      NgxStripeModule.forRoot(environment.STRIPE_KEY),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        },
        defaultLanguage: 'en'
      }),
      NgxsModule.forRoot([
        AuthState,
        Auth0State
      ]),
      NgxsFormPluginModule.forRoot(),
      NgxsReduxDevtoolsPluginModule.forRoot({ disabled: false }),
      NgxsLoggerPluginModule.forRoot({ disabled: false }),
      NgxsStoragePluginModule.forRoot({
        key: [
          'auth0',
          'auth',
        ]
      }),
    ),
    provideRouter(routes),
  ],
});
