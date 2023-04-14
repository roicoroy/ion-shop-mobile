import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { MessageComponent } from '../message/message.component';

import { DataService, Message } from '../services/data.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { NavigationService } from '../shared/services/navigation/navigation.service';
import { ActivatedRoute } from '@angular/router';
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
    MessageComponent,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule
  ],
})
export class HomePage {
  private data = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);

  viewState$: Observable<any>;

  constructor(
    private navigation: NavigationService,
    private facade: HomePageFacade,
  ) {
    this.viewState$ = this.facade.viewState$;
    this.viewState$.subscribe((vs) => {
      console.log(vs);
    })
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  getProducts(): Message[] {
    return this.data.getProducts();
  }
  loginPages() {
    this.navigation.navControllerDefault('auth-home');
  }
}
