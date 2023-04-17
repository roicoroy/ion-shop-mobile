import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NgxsModule, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { UtilityService } from 'src/app/shared/services/utility/utility.service';
import { FcmService } from 'src/app/shared/services/fcm.service';
import { StrapiService } from 'src/app/shared/services/strapi.service';
import { IUser } from 'projects/strapi-auth/src/public-api';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { TranslateModule } from '@ngx-translate/core';
import { KeypadModule } from 'src/app/shared/services/native/keyboard/keypad.module';
import { scaleHeight } from 'src/app/shared/services/animations/animations';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
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
    ImagePickerComponent,
    KeypadModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class UserPage implements OnInit, AfterViewInit {

  avatar: string;

  pushAccepted = false;

  strapiUserState$: Observable<any>;

  strapiProfileForm: FormGroup;

  validation_messages: any = {
    username: [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    first_name: [
      { type: 'required', message: 'Name is required.' }
    ],
    last_name: [
      { type: 'required', message: 'Last name is required.' }
    ],
    address_1: [
      { type: 'required', message: 'Address 1 line name is required.' }
    ],
    address_2: [
      { type: 'required', message: 'Address 2 line name is required.' }
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    phone: [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'The phone is incorrect for the selected country.' }
    ],
    city: [
      { type: 'required', message: 'City is required.' },
    ],
    postal_code: [
      { type: 'required', message: 'Post Code is required.' },
    ],
    country: [
      { type: 'required', message: 'Country is required.' },
    ],
  };

  strapiUser: IUser | any;

  userId: string;

  regionsList: any[];

  countries: any = [];

  countriesList: any = [];

  selectedCountry: any;

  fcmToken: string;

  hasToken = false;

  get regionCodeControl() {
    return this.strapiProfileForm.get('region_code') as FormControl;
  }
  get countryControl() {
    return this.strapiProfileForm.get('country') as FormControl;
  }
  get acceptedFcmControl() {
    return this.strapiProfileForm.get('accepted_fcm') as FormControl;
  }
  get strapiFormGroup() {
    return this.strapiProfileForm as FormGroup;
  }

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private strapi: StrapiService,
    private toastCtrl: ToastController,
    private store: Store,
    private fcm: FcmService,
    private utility: UtilityService,
    private navigation: NavigationService,
  ) {
    this.strapiProfileForm = this.formBuilder.group({
      username: new FormControl({ value: '', disabled: false }, Validators.compose([
        Validators.required
      ])),
      email: new FormControl({ value: '', disabled: false }, Validators.compose([
        Validators.required,
      ])),
      region_code: new FormControl(''),
      country: new FormControl(''),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      address_1: new FormControl('', Validators.required),
      address_2: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      postal_code: new FormControl('', Validators.required),
      accepted_fcm: new FormControl(null),
      phone: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }
  ngOnInit(): void {
    // this.fcm.initPush();

    // this.userId = this.store.selectSnapshot<string>((state) => state.authState.userId);
    // // console.log('this.userId', this.userId);

    // this.store.dispatch(new AuthActions.LoadUser(this.userId));
    // .subscribe((state) => {
    //   // this.strapiUser = state.authState.user;
    // });
    // console.log('this.strapiUser', this.strapiUser);

    // this.strapiUser = this.store.selectSnapshot<AuthStateModel>((state) => state.authState.user);

    this.regionsList = [];
    this.countries = [
      {
        name: 'United Kingdom',
      },
      {
        name: 'Ireland',
      },
      {
        name: 'France',
      }
    ];
  }
  ngAfterViewInit() {
    console.log('this.strapiUser', this.strapiUser);
    if (this.strapiUser) {
      console.log('this.strapiUser', this.strapiUser);
      console.log('this.avatar', this.avatar);

      console.log('tthis.strapiUser?.avatar?.url', this.strapiUser?.avatar?.url);
      this.avatar = this.strapiUser?.avatar?.url != null ? this.strapiUser.avatar?.url : 'assets/shapes.svg';
      console.log('this.avatar', this.avatar);
      if (this.strapiUser.accepted_fcm) {
        this.pushAccepted = this.strapiUser.accepted_fcm;
        this.acceptedFcmControl.setValue(this.pushAccepted);
      }
      if (this.strapiUser?.country) {
        this.strapiProfileForm.get('country').setValue(this.strapiUser?.country);
      }
      if (this.strapiUser?.username && this.strapiUser?.email) {
        this.strapiProfileForm.get('username').setValue('asd');
        this.strapiProfileForm.get('email').setValue(this.strapiUser?.email);
      }
    }
  }

  onToggleChange($event: any) {
    this.pushAccepted = $event.detail.checked;
    this.updateStrapiUser();
  }

  updateStrapiUser() {
    // this.utility.presentLoading('Updating profile...');
    // this.store.dispatch(new AuthActions.UpdateStrapiUser(this.strapiUser?.id, this.strapiProfileForm.value))
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe),
    //   )
    //   .subscribe((state) => {
    //     // this.utility.dismissLoading();
    //     this.utility.showToast('Profile updated successfully', 'middle', 750);
    //   });
    // console.log(this.strapiProfileForm.value);
  }

  async onImagePicked(file: RequestInfo | URL | any) {
    // this.upload.onImagePicked(file, this.strapiUser);
    const response = await fetch(file);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('files', blob, file.name);
    this.uploadData(formData);
  }

  async uploadData(formData: FormData) {
    this.strapi.uploadData(formData).subscribe((response: any) => {
      if (response) {
        const fileId = response[0].id;
        // console.log(response, fileId);
        this.strapi.setProfileImage(this.strapiUser?.id, fileId)
          .subscribe((user: any) => {
            console.log(user);
            // // this.store.dispatch(new AuthActions.SetUploadedUser(user))
            //   .pipe(
            //     takeUntil(this.ngUnsubscribe),
            //   ).subscribe((state) => {
            //     console.log(state);
            //   });
            this.utility.showToast('Profile updated successfully', 'middle', 750);
          });
      }
    });
  }

  async presentToast(text: any) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
    });
    toast.present();
  }

  homePage() {
    this.navigation.navigateForward('/home', 'back');
  }

  settingsPage() {
    this.navigation.navigateFlip('/auth/profile/settings');
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
