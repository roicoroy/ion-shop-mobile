import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { RegisterBaseComponent } from '../../base-components/register-base/register-base.component';

@Component({
  selector: 'strapi-default-register',
  templateUrl: './default-register.component.html',
  styleUrls: ['./default-register.component.scss']
})
export class DefaultRegisterComponent extends RegisterBaseComponent {
  constructor(
    protected override router: Router,
    protected override authService: AuthService,
    protected override translate: TranslateService
  ) {
    super(router, authService, translate);
  }
}
