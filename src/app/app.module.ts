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
import { AuthState } from './store/auth.state';
import { StrapiAuthInterceptor } from './shared/strapi.interceptor';
import { environment } from '../environments/environment';

import { ThemeState } from './store/theme.state';
import { FcmState } from './store/fcm/fcm.state';

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
      ThemeState
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
      useClass: StrapiAuthInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
