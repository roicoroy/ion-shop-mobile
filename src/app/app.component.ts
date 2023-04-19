import { Component, inject } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AppFacade } from './app-facade';
import { Store } from '@ngxs/store';
import { FcmActions } from './store/fcm/fcm.actions';
import { LanguageService } from './shared/services/language/language.service';
import { NavigationService } from './shared/services/navigation/navigation.service';
import { ThemeService } from './shared/services/theme/theme-settings.service';
import { AuthStateService } from './store/auth/auth-state.service';
import { AppService } from './shared/services/application/application.service';
import { TokenService } from './shared/services/token/token.service';
import { AuthStateActions } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  viewState$: Observable<any>;

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
  ];

  private native = inject(AppService);
  private platform = inject(Platform);
  private tokenService = inject(TokenService);
  private store = inject(Store);

  constructor(
    private authService: AuthStateService,
    private ionLanguageService: LanguageService,
    public menu: MenuController,
    private navigation: NavigationService,
    private facade: AppFacade,
    private theme: ThemeService,

  ) {
    this.initApp();
  }
  async initApp() {
    this.platform.ready().then(async () => {
      // get medusa products
      // set theme
      // tutorial
      const device = await this.native.getDeviceInfo();
      const token = this.tokenService.getToken();
      this.theme.themeInit();
      this.ionLanguageService.initTranslate();
      this.viewState$ = this.facade.viewState$;

      if (token) {
        this.store.dispatch(new AuthStateActions.SetLoggedIn(true));
      }

      if (device.platform == 'web') {
      }

      if (device.platform === 'android' || device.platform === 'ios') {
        // set fcm listeners
      }
    });
  }
  logout(): void {
    // this.authService.();
  }
  profilePage() {
    this.navigation.navigateFlip('/auth/profile/strapi');
  }
  loginPage() {
    this.navigation.navigateFlip('/auth/login');
    // this.router.navigateByUrl('/auth/login');
  }
}
