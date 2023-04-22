import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
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
import { Observable, Subject, takeUntil } from 'rxjs';
import { CartMenuComponent } from 'src/app/components/components/app-menu/cart-menu.component';
import { MedusaCartComponent } from 'src/app/components/components/medusa-cart/medusa-cart.component';
import { clearSelectedProduct } from './store/products/products.actions';
import { CommonModule } from '@angular/common';
import { CustomComponentsModule } from './components/components.module';
import { KeyboardService } from './shared/services/native/keyboard/keyboard.service';
import { NavigationService } from './shared/services/navigation/navigation.service';

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
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MedusaCartComponent) medusaCartComponent: MedusaCartComponent;

  @ViewChild(CartMenuComponent) menuComponent: CartMenuComponent;

  private native = inject(AppService);
  private platform = inject(Platform);
  private tokenService = inject(TokenService);
  private store = inject(Store);
  private theme = inject(ThemeService);
  private facade = inject(AppFacade);
  private menu = inject(MenuController);
  private navigation = inject(NavigationService);
  private keyboardService = inject(KeyboardService);

  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<IAppFacadeState>;


  async ngOnInit(): Promise<void> {
    await this.initApp();
  }

  async initApp() {
    this.platform.ready().then(async () => {
      this.viewState$ = this.facade.viewState$;
      this.viewState$
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((vs) => { });
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
        this.keyboardService.setAccessoryBarVisible(true).catch(() => { });
        this.keyboardService.initKeyboardListeners();
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
  homePage(): void {
    this.navigation.navControllerDefault('/start/tabs/home')
  }
  loginPage(): void {
    this.navigation.navControllerDefault('/auth/pages/auth-home')
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
