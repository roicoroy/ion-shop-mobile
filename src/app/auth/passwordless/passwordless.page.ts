import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@capacitor/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { StrapiService } from 'src/app/shared/services/strapi/strapi.service';

@Component({
  selector: 'app-passwordless',
  templateUrl: './passwordless.page.html',
  styleUrls: ['./passwordless.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,ReactiveFormsModule, FormsModule]
})
export class PasswordlessPage implements OnInit, OnDestroy {

  passwordlessForm: FormGroup;

  tokenForm: FormGroup;

  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
  };

  private readonly ngUnsubscribe = new Subject();

  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private store: Store,
    private navigation: NavigationService,
    private strapi: StrapiService,
  ) {
    this.passwordlessForm = this.formBuilder.group({
      username: new FormControl('roicoroyAmigao', Validators.compose([
        // UsernameValidator.validUsername,
        // Validators.maxLength(35),
        // Validators.minLength(5),
        // Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required
      ])),
      email: new FormControl('roicoroy@mercadoamigao.com', Validators.compose([
        // Validators.required,
        // Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });

  }

  ngOnInit() {
  }

  onSubmit(values: any) {
    console.log(values);
    const data = {
      username: values.username,
      email: values.email,
    }
    console.log(data);
    this.strapi.loginPasswordless(values)
      .subscribe((response) => {
        console.log(response);
      })
  }
  postTokenCallback(token: any) {
    console.log(token.token);
    this.strapi.passwordlessCallback(token);
    // this.strapi.loginPasswordless(token.token)
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe),
    //   ).subscribe((user: any) => {
    //     console.log(user);
    //     this.store.dispatch(new AuthActions.SetIdToken(user?.user?.id, user?.jwt))
    //     this.store.dispatch(new AuthActions.SetUser(user));
    //     this.navigation.navigateForward('/home', 'forward');
    //   });
  }
  back() {
    this.navigation.navControllerDefault('auth-home')
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}