import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
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
export class ProfilePage {
  private navigation = inject(NavigationService);

  userPage() {
    this.navigation.navControllerDefault('/user');
  }
}
