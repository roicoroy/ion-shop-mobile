import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, ViewChild, inject, OnDestroy } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule, Platform } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule, Store } from "@ngxs/store";
import { LoginFormComponent } from "src/app/form-components/components/login-form/login-form.component";
import { FormComponentsModule } from "projects/form-components/src/public-api";
import { Observable, Subject, takeUntil } from "rxjs";
import { scaleHeight } from "src/app/shared/animations/animations";
import { KeypadModule } from "src/app/shared/services/native/keyboard/keypad.module";
import { NavigationService } from "src/app/shared/services/navigation/navigation.service";
import { IStrapiLoginData, ICustomerLoginData } from "src/app/shared/types/types.interfaces";
import { EmailPasswordActions } from "src/app/store/auth/email-password/email-password.actions";
import { IEmailPasswordFacadeState } from "./email-password.facade";

@Component({
  selector: 'app-email-password',
  templateUrl: './email-password.page.html',
  styleUrls: ['./email-password.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [
    scaleHeight()
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxsModule,
    ReactiveFormsModule,
    FormComponentsModule,
    KeypadModule
  ]
})
export class EmailPasswordPage implements OnDestroy {
  @ViewChild('form') form: LoginFormComponent;

  loginReq: IStrapiLoginData;

  viewState$: Observable<IEmailPasswordFacadeState>;

  private platform = inject(Platform);
  private store = inject(Store);
  private navigation = inject(NavigationService);
  
  // private utility = inject(UtilityService);
  // private facade = inject(EmailPasswordFacade);

  subscription = new Subject();

  constructor() {
    // this.viewState$ = this.facade.viewState$;
  }

  ionViewDidEnter() {
    this.form?.loginForm.get('email').setValue("test@test.com");
    this.form?.loginForm.get('password').setValue("Rwbento123!");
  }

  async login(): Promise<void> {
    const medusaRequest: ICustomerLoginData = {
      email: this.form?.loginForm.get('email').value,
      password: this.form?.loginForm.get('password').value,
    };
    this.store.dispatch(new EmailPasswordActions.LoginEmailPassword(this.form?.loginForm.get('email').value, this.form?.loginForm.get('password').value,))
      .pipe(takeUntil(this.subscription))
      .subscribe((vs) => {
        console.log('mmmmm', vs)
        if (vs.authState.isLoggedIn) {
          this.navigation.navControllerDefault('start/tabs/home');
        }
      });
    // const errorEntry = this.store.selectSnapshot<any>((state) => state.errorsLogging.errorEntry);
  }
  back(): void {
    this.navigation.navControllerDefault('/auth-home');
  }
  register(): void {
    // this.navigation.navControllerDefault(AuthRoutePath.registerUser);
  }
  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return isIos ? 'Inbox' : '';
  }
  ngOnDestroy() {
    this.subscription.next(null);
    this.subscription.complete();
  }
}
