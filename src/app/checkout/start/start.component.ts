import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { StartFacade } from "./start.facade";
import { NavigationService } from "src/app/shared/services/navigation/navigation.service";
import { AuthStateActions } from "src/app/store/auth/auth.actions";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartComponent {

  viewState$: Observable<any>;

  isLogged: boolean;

  constructor(
    private navigation: NavigationService,
    private facade: StartFacade,
    private store: Store,
    private modalCtrl: ModalController,
  ) {
    this.viewState$ = this.facade.viewState$;
    this.viewState$.subscribe((state) => {
      console.log(state.isLoggedIn);
      if (!state.isLoggedIn) {
        this.store.dispatch(new AuthStateActions.getMedusaSession);
      }
    });
  }
  navigateBack() {
    this.navigation.navigateForward('/start/tabs/home', 'back');
  }
  cartReviewMedusa() {
    this.navigation.navigateFlip('/checkout/flow/cart-review');
  }
  addressesMedusa() {
    this.navigation.navigateForward('/checkout/flow/cart-addresses', 'forward');
  }
  checkoutMedusa() {
    this.navigation.navigateForward('/checkout/flow/shipping', 'forward');
  }
  logoutUser() {
    // this.auth.logoutUser();
  }
}
