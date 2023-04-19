import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { TranslateModule } from '@ngx-translate/core';
import { KeypadModule } from 'src/app/shared/services/native/keyboard/keypad.module';

import { UserProfileFacade } from './user-facade';
import { scaleHeight } from 'src/app/shared/animations/animations';
import { StrapiService } from 'src/app/shared/services/strapi/strapi.service';

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
  // schemas: [
  //   CUSTOM_ELEMENTS_SCHEMA
  // ]
})
export class UserPage implements OnInit, AfterViewInit {
  formData = new FormData();
  avatar: string;
  pushAccepted = false;
  isDarkMode = false;

  userForm: FormGroup;
  uploadForm: FormGroup;

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
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
  };


  viewState$: Observable<any>;

  private readonly ngUnsubscribe = new Subject();

  private facade = inject(UserProfileFacade);
  private formBuilder = inject(FormBuilder);
  private strapi = inject(StrapiService);

  constructor() {

    this.viewState$ = this.facade.viewState$;
    this.viewState$.subscribe((vs) => {
      console.log(vs?.user?.avatar);
      this.avatar = vs?.user.avatar?.url;
    });

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });

    this.userForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      accepted_fcm: new FormControl(null),
    });
  }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
  }

  onFCMChange($event: any) {
    this.pushAccepted = $event.detail.checked;
    console.log($event.detail.checked);
    // this.updateStrapiUser();
    // lad strai nuser
  }

  onDarkModeChange($event: any) {
    this.isDarkMode = $event.detail.checked;
    console.log($event.detail.checked);
    // this.updateStrapiUser();
    // lad strai nuser
  }
  async onFileSelect(file: any) {
    const response = await fetch(file);
    const blob = await response.blob();
    this.uploadForm.get('profile').setValue(file);
  }
  uploadProfilePicture() {
    // const formData = new FormData();
    // formData.append('file', this.uploadForm.get('profile').value);

    // console.log(this.uploadForm.get('profile').value);
    this.facade.appUploadProfileImage(this.formData);
    // if (this.formData) {
    //   this.facade.appUploadProfileImage(this.formData);
    // }
  }
  async onImagePicked(file: any) {
    // // this.upload.onImagePicked(file, this.strapiUser);
    // const response = await fetch(file);
    // const blob = await response.blob();
    // const formData = new FormData();
    // formData.append('files', blob, file.name);
    // this.uploadData(formData);
    const response = await fetch(file);
    const blob = await response.blob();
    const blobs = new Blob([blob], { type: "text/xml" });
    const formData = new FormData();
    formData.append('files', blob, file.name);
    this.formData.append('files', blob, file.name);
    return this.formData;
  }

  async uploadData(formData: FormData) {
    this.strapi.uploadData(formData).subscribe((response: any) => {
      if (response) {
        const fileId = response[0].id;
        // console.log(response, fileId);
        // this.strapi.setProfileImage(this.strapiUser?.id, fileId)
        //   .subscribe((user: any) => {
        //     console.log(user);
        //     // this.store.dispatch(new AuthActions.SetUploadedUser(user))
        //     //   .pipe(
        //     //     takeUntil(this.ngUnsubscribe),
        //     //   ).subscribe((state) => {
        //     //     console.log(state);
        //     //   });
        //   });
      }
    });
  }
  changePasswordPage() {
    // this.navigation.navigateForward('/home', 'back');
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
