import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-passwordless-callback',
  templateUrl: './passwordless-callback.page.html',
  styleUrls: ['./passwordless-callback.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PasswordlessCallbackPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
