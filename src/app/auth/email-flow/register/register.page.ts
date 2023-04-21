import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import Validation from 'src/app/form-components/validators/validation';
import { IReqAuthRegister } from 'src/app/shared/types/requests/ReqAuthRegister';
import { IErrorRes } from 'src/app/shared/types/responses/AuthError';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule
  ]
})
export class RegisterPage implements OnInit {

  // private facade = inject(HomePageFacade);
  // private facade = inject(HomePageFacade);

  public registerReq: IReqAuthRegister;
  public formGroup: UntypedFormGroup = new UntypedFormGroup({
    first_name: new UntypedFormControl('first_name', [Validators.required]),
    last_name: new UntypedFormControl('last_name', [Validators.required]),
    email: new UntypedFormControl('test@test.com', [
      Validators.required,
      Validators.email
    ]),
    username: new UntypedFormControl('test', [Validators.required]),
    password: new UntypedFormControl('Rwbento123!', [Validators.required]),
    passwordConfirmation: new UntypedFormControl('Rwbento123!', [Validators.required])
  },
    {
      validators: [Validation.match('password', 'passwordConfirmation')]
    }
  );

  public error: IErrorRes;

  constructor() { }

  ngOnInit() {
  }
  public register(): void {
    this.registerReq = this.formGroup.value;
    console.log(this.registerReq);
  }
}
