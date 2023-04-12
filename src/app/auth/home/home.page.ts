import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
  ]
})
export class HomePage implements OnInit {

  constructor(
    private navigation: NavigationService,
  ) { }

  ngOnInit() {
  }
  strapiAuth0() {

  }
  loginPasswordless() {
    this.navigation.navControllerDefault('passwordless');
  }
  home() {
    this.navigation.navControllerDefault('home');
  }
  loginEmailPassword() {

  }
}
