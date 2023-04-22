import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, UntypedFormGroup, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import Validation from 'src/app/form-components/validators/validation';
import { LanguageModule } from 'src/app/shared/services/language/language.module';
import { KeypadModule } from 'src/app/shared/services/native/keyboard/keypad.module';
import { IUser } from 'src/app/shared/types/models/User';
import { IReqPasswordReset } from 'src/app/shared/types/requests/ReqPasswordReset';
import { IErrorRes } from 'src/app/shared/types/responses/AuthError';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    ReactiveFormsModule,
    KeypadModule,
    LanguageModule
  ],
})
export class ChangePasswordModalComponent implements OnInit {

  @Input() incomingMessage: string;

  private userObj: IUser;
  private oldUserObj: IUser;

  public passwordFormGroup: UntypedFormGroup = new UntypedFormGroup(
    {
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}'
        )
      ]),
      passwordConfirmation: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}'
        )
      ]),
      oldPassword: new UntypedFormControl('', [Validators.required])
    },
    {
      validators: [Validation.match('password', 'passwordConfirmation')]
    }
  );

  public error: IErrorRes;
  public passwordError: IErrorRes;

  constructor(
    private modalCtrl: ModalController,
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected route: ActivatedRoute,
    protected translate: TranslateService
  ) { }

  ngOnInit() {
    // this.oldUserObj = this.authService.getUser();

    // if (this.oldUserObj) {
    //   this.userObj = {
    //     ...this.oldUserObj
    //   };

    //   this.formGroup.setValue({
    //     username: this.userObj.username,
    //     email: this.userObj.email
    //   });
    // }

    // this.authService.UserState.subscribe(() => {
    //   this.oldUserObj = this.authService.getUser();
    //   this.userObj = {
    //     ...this.oldUserObj
    //   };

    //   this.formGroup.setValue({
    //     username: this.userObj.username,
    //     email: this.userObj.email
    //   });
    // });
  }
  public resetPassword(): void {
    // this.authService
    //   .resetPassword(this.passwordResetReq)
    //   .then(() => {
    //     this.router.navigateByUrl(this.authService.LoginUrl);
    //   })
    //   .catch((err: HttpErrorResponse) => {
    //     this.error = err.error;
    //   });
  }
  public updatePassword(): void {
    // const updateRequest: IReqPasswordUpdate = {
    //   password: this.passwordFormGroup.value.password,
    //   oldPassword: this.passwordFormGroup.value.oldPassword
    // };

    // if (!updateRequest.password || !updateRequest.oldPassword) {
    //   return;
    // }

    // this.authService
    //   .updateProfile(updateRequest)
    //   .then(() => {
    //     this.passwordError = null;

    //     this.passwordFormGroup.reset();
    //     this.passwordFormGroup.markAsPristine();
    //   })
    //   .catch((err: HttpErrorResponse) => {
    //     this.passwordError = err.error;
    //   });
  }
  async submitForm() {
    await this.modalCtrl.dismiss();
  }
  async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
