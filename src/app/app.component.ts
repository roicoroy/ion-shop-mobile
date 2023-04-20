import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { IonicModule, MenuController, Platform } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { AuthStateActions } from './store/auth/auth.actions';
import { AppService } from './shared/services/application/application.service';
import { TokenService } from './shared/services/token/token.service';
import { ThemeService } from './store/theme/theme.service';
import { AppFacade, IAppFacadeState } from './app.facade';
import { Observable } from 'rxjs';
import { CartMenuComponent } from 'src/app/components/components/app-menu/cart-menu.component';
import { MedusaCartComponent } from 'src/app/components/components/medusa-cart/medusa-cart.component';
import { clearSelectedProduct } from './store/products/products.actions';
import { CommonModule } from '@angular/common';
import { CustomComponentsModule } from './components/components.module';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    CustomComponentsModule
  ],
})
export class AppComponent implements OnInit {
  @ViewChild(MedusaCartComponent) medusaCartComponent: MedusaCartComponent;

  @ViewChild(CartMenuComponent) menuComponent: CartMenuComponent;

  private native = inject(AppService);
  private platform = inject(Platform);
  private tokenService = inject(TokenService);
  private store = inject(Store);
  private theme = inject(ThemeService);
  private facade = inject(AppFacade);
  private menu = inject(MenuController);
  viewState$: Observable<IAppFacadeState>;

  ngOnInit(): void {
    this.initApp();
  }

  async initApp() {
    this.platform.ready().then(async () => {
      this.viewState$ = this.facade.viewState$;
      // get medusa products
      this.theme.themeInit();
      const device = await this.native.getDeviceInfo();
      const token = await this.tokenService.getToken();
      if (token) {
        this.store.dispatch(new AuthStateActions.SetLoggedIn(true));
      }
      if (device.platform == 'web') {
      }
      if (device.platform === 'android' || device.platform === 'ios') {
        // set fcm listeners
      }
    }).catch(e => {
      throw e;
    });
  }
  checkout() {
    this.menu.toggle('end').then(() => {
      this.medusaCartComponent.goToCheckout();
      this.store.dispatch(new clearSelectedProduct());
    });
  }
  logout(): void {
    this.store.dispatch(new AuthStateActions.AuthStateLogout());
      // .subscribe((authState) => {
      //   console.log(authState);
      // });
  }
}
