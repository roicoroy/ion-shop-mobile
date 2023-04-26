import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { IProfileFacadeState, ProfileFacade } from '../profile.facade';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class AddressesPage implements OnInit {

  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private facade = inject(ProfileFacade);

  subscription = new Subject();

  viewState$: Observable<IProfileFacadeState>;

  constructor() { }

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    this.viewState$.subscribe((vs) => {
      console.log(vs?.customer);
      console.log(vs.customer?.shipping_addresses
      );
    });
  }
  addAddress() {
    this.router.navigate(['address-details'], { queryParams: { address: null } });
  }
  details() {
    const address = {
      address_1: '23',
      address_2: 'NewHaven Place',
      postal_code: 'ED00KL',
      phone: '123123',
    };
    this.router.navigate(['address-details'], { queryParams: address });
  }
}
