import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { ShippingActions } from "src/app/store/shipping/shipping.actions";
import { RoutePath } from "../route-path.enum";
import { ShippingFacade } from "./shippping.facade";
import { NavigationService } from "src/app/shared/services/navigation/navigation.service";

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss'],
})
export class ShippingComponent {

  viewState$: Observable<any>;

  constructor(
    private router: Router,
    private navigation: NavigationService,
    private store: Store,
    private facade: ShippingFacade,
  ) {
    this.viewState$ = this.facade.viewState$;
  }

  ionViewWillEnter() {
    this.store.dispatch(new ShippingActions.GetShippingOptions());
  }

  onAddShippingMethod($event: any) {
    if ($event.detail.value != null) {
      this.store.dispatch(new ShippingActions.AddShippingMethod($event.detail.value));
      this.initPaymentSession();
    }
  }
  initPaymentSession() {
    this.store.dispatch(new ShippingActions.CreatePaymentSessions());
  }
  onAddPymentSession($event: any) {
    this.store.dispatch(new ShippingActions.SetPaymentSession($event.detail.value));
  }

  openPaymentPage() {
    this.router.navigateByUrl('/checkout/flow/payment');
  }
  back() {
    this.router.navigateByUrl('/checkout/flow/' + RoutePath.cartAddresses);
  }
  navigateToPayment() {
    this.router.navigateByUrl(RoutePath.payment);
  }
}
