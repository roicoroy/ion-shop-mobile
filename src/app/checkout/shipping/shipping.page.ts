import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { Observable, Subject } from 'rxjs';
import { CustomComponentsModule } from 'src/app/components/components.module';
import { IShippingFacadeState, ShippingFacade } from './shipping.facade';
import { ShippingActions } from 'src/app/store/shipping/shipping.actions';

@Component({
  selector: 'app-shipping',
  templateUrl: 'shipping.page.html',
  styleUrls: ['shipping.page.scss'],
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
export class ShippingPage implements OnDestroy {

  private navigation = inject(NavigationService);
  private facade = inject(ShippingFacade);
  private store = inject(Store);
  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<IShippingFacadeState>;

  constructor() {
    this.viewState$ = this.facade.viewState$;
    this.viewState$.subscribe((vs) => {
      console.log('shipping page vs:', vs);
    });
  }
  ionViewWillEnter() {
    this.store.dispatch(new ShippingActions.GetShippingOptions());
  }
  onAddShippingMethod(shippingMethod: any) {
    console.log(shippingMethod.detail.value);
    if (shippingMethod.detail.value != null) {
      this.store.dispatch(new ShippingActions.AddShippingMethod(shippingMethod.detail.value));
      // this.initPaymentSession();
    }
  }
  initPaymentSession() {
    this.store.dispatch(new ShippingActions.CreatePaymentSessions());
  }
  onAddPymentSession($event: any) {
    console.log($event);
    this.store.dispatch(new ShippingActions.SetPaymentSession($event.detail.value));
  }
  next() {
    this.navigation.navControllerDefault('checkout/pages/checkout-home');
  }
  back() {
    this.navigation.navControllerDefault('checkout/pages/checkout-home');
  }
  logout() {
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
