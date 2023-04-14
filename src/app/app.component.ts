import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { AppService } from './shared/services/native/app/app.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

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

  constructor(
    private native: AppService,
    private platform: Platform,
  ) { }

  ngOnInit(): void {
  }

  async initApp() {
    this.platform.ready().then(async () => {
      const device = await this.native.getDeviceInfo();
      if (device.platform == 'web') {
      }
      if (device.platform === 'android' || device.platform === 'ios') {
      }
    }).catch(e => {
      throw e;
    });
  }
}
