import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { NavigationService } from '../shared/services/navigation/navigation.service';
import { Observable } from 'rxjs';
import { HomePageFacade } from './home-facade';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule
  ],
})
export class HomePage {

  private navigation = inject(NavigationService);
  private facade = inject(HomePageFacade);
  private store = inject(Store);

  viewState$: Observable<any>;

  constructor(
  ) {
    this.viewState$ = this.facade.viewState$;
    this.viewState$.subscribe((vs) => {
      console.log(vs);
    });
  }
  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }
  loginPages() {
    this.navigation.navControllerDefault('auth-home');
  }
  logout(){
    this.facade.appLogout();
  }
}
