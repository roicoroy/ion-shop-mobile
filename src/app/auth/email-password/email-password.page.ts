import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule, Store } from "@ngxs/store";
import { LoginFormComponent } from "projects/form-components/src/lib/components/login-form/login-form.component";
import { FormComponentsModule } from "projects/form-components/src/public-api";
import { IStrapiLoginData, ICustomerLoginData } from "projects/types/types.interfaces";
import { NavigationService } from "src/app/shared/services/navigation/navigation.service";
import { UtilityService } from "src/app/shared/services/utility/utility.service";
import { EmailPasswordActions } from "src/app/store/auth/email-password/email-password.actions";


@Component({
  selector: 'app-email-password',
  templateUrl: './email-password.page.html',
  styleUrls: ['./email-password.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxsModule,
    ReactiveFormsModule,
    FormComponentsModule
  ]
})
export class EmailPasswordPage {

  @ViewChild('form') form: LoginFormComponent;

  loginReq: IStrapiLoginData;

  constructor(
    private store: Store,
    private navigation: NavigationService,
    private utility: UtilityService,
  ) { }

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

    // const errorEntry = this.store.selectSnapshot<any>((state) => state.errorsLogging.errorEntry);

    // setTimeout(() => {
    //   if (errorEntry === null) {
    //     this.navigation.navigateFlip('/home');
    //   }
    // }, 50);
  }
  back(): void {
    this.navigation.navControllerDefault('/home');
  }
  register(): void {
    // this.navigation.navControllerDefault(AuthRoutePath.registerUser);
  }
}
