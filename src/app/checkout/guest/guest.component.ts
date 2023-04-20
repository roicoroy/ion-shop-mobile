import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { GuestFormComponent } from 'src/app/form-components/components/guest-form/guest-form.component';
import { Observable } from 'rxjs';
import { CartActions } from 'src/app/store/cart/cart.actions';
import { RoutePath } from '../route-path.enum';
import { GuestFacade } from './guest.facade';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss'],
})
export class GuestComponent implements OnInit {

  @ViewChild('guestForm') guestForm: GuestFormComponent;

  viewState$: Observable<any>;

  constructor(
    private navigation: NavigationService,
    private store: Store,
    private modalCtrl: ModalController,
    private facade: GuestFacade,
  ) { }

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
  }

  submitForm() {
    if (this.guestForm.guestForm.get('email').valid) {
      const cart = this.store.selectSnapshot<any>((state) => state.cart?.cart);
      const isGuest = true;
      this.store.dispatch(new CartActions.UpdateCartEmail(cart.id, this.guestForm.guestForm.get('email').value, isGuest));

      const errorEntry = this.store.selectSnapshot<any>((state) => state.errorsLogging.errorEntry);
      if (errorEntry === null) {
        this.modalCtrl.dismiss();
        this.navigation.navControllerDefault('/checkout/flow/' + RoutePath.cartReview);
      }
    }
  }

  back() {
    this.navigation.navControllerDefault('/checkout/flow/' + RoutePath.start);
  }

  async dismiss(email: string) {
    await this.modalCtrl.dismiss();
  }

  async close() {
    await this.modalCtrl.dismiss(null, 'dismiss');
  }
}
