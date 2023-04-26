import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.page.html',
  styleUrls: ['./address-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddressDetailsPage implements OnInit {

  private route = inject(ActivatedRoute);

  address: any;

  constructor() { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      console.log('params address: ', params);
      this.address = params;
    }
    )
  }
}
