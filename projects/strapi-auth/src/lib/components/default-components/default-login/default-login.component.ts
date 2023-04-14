import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginBaseComponent } from '../../base-components/login-base/login-base.component';

@Component({
  selector: 'strapi-default-login',
  templateUrl: './default-login.component.html',
  styleUrls: ['./default-login.component.scss']
})
export class DefaultLoginComponent extends LoginBaseComponent {
  constructor(
    protected override authService: AuthService,
    protected override router: Router,
    protected override translate: TranslateService
  ) {
    super(authService, router, translate);
  }
}
