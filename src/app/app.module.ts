import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxStripeModule } from 'ngx-stripe';
import { registerLocaleData } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import { environment } from '../environments/environment';
import { FcmState } from './store/fcm/fcm.state';
import { AddressesState } from './store/addresses/addresses.state';
import { Auth0State } from './store/auth/auth0/auth0.state';
import { EmailPasswordState } from './store/auth/email-password/email-password.state';
import { CustomerRegisterState } from './store/customer-register/customer-register.state';
import { CustomerState } from './store/customer/customer.state';
import { ErrorLoggingState } from './store/error-logging/error-logging.state';
import { KeyboardState } from './store/keyboard/keyboard.state';
import { UserProfileState } from './store/user-profile/user-profile.state';
import { ThemeState } from './store/theme/theme.state';
import { AuthState } from './store/auth/auth.state';
import { AuthInterceptor } from './shared/interceptor/auth.interceptor';

registerLocaleData(localeEn, 'en');
registerLocaleData(localePt, 'pt');

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    AppRoutingModule,
    HttpClientModule,
    NgxStripeModule.forRoot(environment.STRIPE_KEY),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    IonicStorageModule.forRoot(),
    NgxsModule.forRoot([
      AuthState,
      FcmState,
      ThemeState,
      Auth0State,
      ErrorLoggingState,
      EmailPasswordState,
      CustomerState,
      KeyboardState,
      AddressesState,
      CustomerState,
      CustomerRegisterState,
      UserProfileState
    ]),
    NgxsFormPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: false }),
    NgxsLoggerPluginModule.forRoot({ disabled: true }),
    NgxsStoragePluginModule.forRoot({
      key: [
        'authState',
        'themeState',
      ]
    }),
    // ErrorsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
