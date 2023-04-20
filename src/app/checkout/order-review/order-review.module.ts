import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderReviewPageRoutingModule } from './order-review-routing.module';

import { OrderReviewPage } from './order-review.page';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { CustomComponentsModule } from 'projects/components/src/public-api';
import { FormComponentsModule } from 'projects/form-components/src/public-api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderReviewPageRoutingModule,
    NgxsModule,
    TranslateModule,
    FormsModule,
    CustomComponentsModule,
    FormComponentsModule
  ],
  declarations: [OrderReviewPage]
})
export class OrderReviewPageModule {}
