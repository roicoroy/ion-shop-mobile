import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { Store } from '@ngxs/store';
import { AuthStateActions } from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CustomerPage {

  private navigation = inject(NavigationService);

  ordersPage() {
    this.navigation.navigateForward('/orders', 'forward');
  }
  addressesPage() {
    this.navigation.navigateForward('/customer-addresses', 'forward');
  }
}
