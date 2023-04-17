import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CustomerPage implements OnInit {

  private navigation = inject(NavigationService);

  ngOnInit() {
  }
  ordersPage() {
    this.navigation.navigateForward('/shop/tabs/orders', 'forward');
  }
  addressesPage() {
    this.navigation.navigateForward('/shop/tabs/customer-addresses', 'forward');
  }
}
