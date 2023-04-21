import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { Store } from '@ngxs/store';
import { AddressesActions } from 'src/app/store/addresses/addresses.actions';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { CustomComponentsModule } from 'src/app/components/components.module';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    CustomComponentsModule
  ]
})
export class ProfilePage implements OnInit {
  private navigation = inject(NavigationService);
  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(new AddressesActions.GetRegionList());
  }

  userPage() {
    this.navigation.navControllerDefault('/user');
  }
  customerPage() {
    this.navigation.navControllerDefault('/customer');
  }
}
