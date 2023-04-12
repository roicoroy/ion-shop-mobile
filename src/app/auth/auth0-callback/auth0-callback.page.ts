import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-auth0-callback',
  templateUrl: './auth0-callback.page.html',
  styleUrls: ['./auth0-callback.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Auth0CallbackPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
