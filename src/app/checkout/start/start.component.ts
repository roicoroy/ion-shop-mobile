import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { GuestComponent } from "../guest/guest.component";
import { StartFacade } from "./start.facade";
import { NavigationService } from "src/app/shared/services/navigation/navigation.service";
import { RoutePath } from "../route-path.enum";

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
    // this.viewState$.subscribe((state) => {
    //   console.log(state);
    // });
  }
  navigateBack() {
    this.navigation.navigateForward('/home', 'back');
  }
  cartReviewMedusa() {
    this.navigation.navigateFlip('/checkout/flow/cart-review');
  }
  addressesMedusa() {
    this.navigation.navigateForward('/checkout/flow/cart-addresses', 'forward');
  }
  // loginMedusa() {
  //   this.navigation.navigateForward(RoutePath.login, 'forward');
  // }
  // registerMedusa() {
  //   this.navigation.navigateForward(RoutePath.registerUser, 'forward');
  // }
  async continueAsGuest() {
    const modal = await this.modalCtrl.create({
      component: GuestComponent,
      cssClass: 'guest-modal'
    });
    await modal.present();
  }
  checkoutMedusa() {
    this.navigation.navigateForward('/checkout/flow/shipping', 'forward');
  }
  logoutUser() {
    // this.auth.logoutUser();
  }
}
