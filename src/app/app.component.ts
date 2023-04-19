import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { TokenService } from 'projects/strapi-auth/src/public-api';
import { AuthStateActions } from './store/auth/auth.actions';
import { AppService } from './shared/services/application/application.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule
  ],
})
export class AppComponent implements OnInit {

  private native = inject(AppService);
  private platform = inject(Platform);
  private tokenService = inject(TokenService);
  private store = inject(Store);

  ngOnInit(): void {
    this.initApp();
  }

  async initApp() {
    this.platform.ready().then(async () => {
      // get medusa products
      // set theme
      // tutorial
      const device = await this.native.getDeviceInfo();
      const token = this.tokenService.getToken();
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
}
