import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class ProfilePage implements OnInit {
  private navigation = inject(NavigationService);

  ngOnInit() {
  }

  userPage() {
    this.navigation.navControllerDefault('/user');
  }
  customerPage() {
    this.navigation.navControllerDefault('/shop/tabs/customer');
  }
}
