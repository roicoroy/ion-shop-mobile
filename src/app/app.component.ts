import { Component, OnInit } from '@angular/core';
import { IonicModule, Platform, isPlatform } from '@ionic/angular';
import { AppService } from './shared/services/native/app/app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
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
        this.native.initAppListeners();
        console.log();
      }
    }).catch(e => {
      throw e;
    });
  }
}
