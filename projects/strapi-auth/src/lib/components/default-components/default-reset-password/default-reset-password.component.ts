import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ResetPasswordBaseComponent } from '../../base-components/reset-password-base/reset-password-base.component';

@Component({
  selector: 'strapi-default-reset-password',
  templateUrl: './default-reset-password.component.html',
  styleUrls: ['./default-reset-password.component.scss']
})
export class DefaultResetPasswordComponent extends ResetPasswordBaseComponent {
  constructor(
    protected override cd: ChangeDetectorRef,
    protected override router: Router,
    protected override route: ActivatedRoute,
    protected override authService: AuthService,
    protected override translate: TranslateService
  ) {
    super(cd, router, route, authService, translate);
  }
}
