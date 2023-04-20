import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OrderReviewFacade } from './order-review.facade';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.page.html',
  styleUrls: ['./order-review.page.scss'],
})
export class OrderReviewPage implements OnInit {

  viewState$: Observable<any>;

  constructor(
    private facade: OrderReviewFacade,
    private navigation: NavigationService,
  ) {
    this.viewState$ = this.facade.viewState$;
    this.viewState$.subscribe((state) => {
      console.log(state);
    });
  }

  ngOnInit() {
  }

  // home() {
  //   this.navigation.navigateForward(AuthRoutePath.home, 'forward');
  // }

  // back() {
  //   this.navigation.navigateForward(AuthRoutePath.payment, 'back');
  // }

}
