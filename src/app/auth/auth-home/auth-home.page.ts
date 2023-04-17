import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { App, AppInfo, AppState, URLOpenListenerEvent } from '@capacitor/app';
import { AppLauncher } from '@capacitor/app-launcher';
import { isPlatform } from '@ionic/angular';
import { AppService } from 'src/app/shared/services/native/app/app.service';
import { Browser } from '@capacitor/browser';
import { environment } from 'src/environments/environment';
import { Auth0Service } from 'src/app/store/auth/auth0/auth0.service';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
@Component({
  selector: 'app-home',
  templateUrl: './auth-home.page.html',
  styleUrls: ['./auth-home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule
  ]
})
export class HomePage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  constructor(
    private navigation: NavigationService,
    private native: AppService,
    private auth0Service: Auth0Service,
  ) { }
  async ngOnInit() {
    // this.native.initAppListeners();
  }
  navigateAuth0Callback() {
    this.navigation.navControllerDefault('strapi-auth0')
      // .then(async () => {
      //   return await this.auth0Service.loginStrapiAuth0();
      // });
  }
  loginPasswordless() {
    this.navigation.navControllerDefault('passwordless');
  }
  home() {
    this.navigation.navControllerDefault('home');
  }
  loginEmailPassword() {
    this.navigation.navControllerDefault('email-password');
  }
}
