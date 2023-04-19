import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { Store } from '@ngxs/store';
import { AuthStateActions } from 'src/app/store/auth/auth.actions';
import { CustomerFacade } from './customer.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CustomerPage {

  private navigation = inject(NavigationService);

  private facade = inject(CustomerFacade);

  viewState$: Observable<any>;

  constructor() {
    this.setupCustomer();
    this.viewState$ = this.facade.viewState$;
    this.viewState$.subscribe((state) => {
      console.log(state);
    });
  }
  setupCustomer() {
    this.facade.getCustomer();
  }
  ordersPage() {
    this.navigation.navigateForward('/orders', 'forward');
  }
  addressesPage() {
    this.navigation.navigateForward('/customer-addresses', 'forward');
  }
}
