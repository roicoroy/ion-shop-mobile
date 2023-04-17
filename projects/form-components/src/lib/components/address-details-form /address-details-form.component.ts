import { Component, forwardRef, ChangeDetectionStrategy, OnInit, OnDestroy } from "@angular/core";
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";
import { Subscription, Observable, Subject } from "rxjs";
import { CountryPhone } from "../address-form/country-phone.model";
import { AddressDetailsFormFacade } from "./address-details-form.facade";
import { fade } from "src/app/shared/services/animations/animations";

@Component({
  selector: 'app-address-details-form',
  templateUrl: './address-details-form.component.html',
  styleUrls: ['./address-details-form.component.scss'],
  animations: [
    fade()
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressDetailsFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressDetailsFormComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressDetailsFormComponent implements OnInit, ControlValueAccessor, OnDestroy {

  adressDetailsForm: FormGroup | any;

  onChange: any = () => { };
  onTouched: any = () => { };

  subscriptions: Subscription[] = [];

  private readonly ngUnsubscribe = new Subject();

  get value() {
    return this.adressDetailsForm.value;
  }
  set value(value: any) {
    this.adressDetailsForm?.setValue(value);
    this.onChange(value);
    this.onTouched();
  }
  get regionCodeControl() {
    return this.adressDetailsForm.get('region_code');
  }
  validation_messages = {
    'first_name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'last_name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'address_1': [
      { type: 'required', message: 'Name is required.' }
    ],
    'address_2': [
      { type: 'required', message: 'Name is required.' }
    ],
    'region_code': [
      { type: 'required', message: 'Name is required.' }
    ],
    'country': [
      { type: 'required', message: 'Name is required.' }
    ],
    'city': [
      { type: 'required', message: 'Name is required.' }
    ],
    'postal_code': [
      { type: 'required', message: 'Name is required.' }
    ],
    'phone': [
      { type: 'required', message: 'Name is required.' }
    ],

  };

  viewState$: Observable<any>;

  phoneNumberPlaceholder: string;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private facade: AddressDetailsFormFacade,
  ) {
    this.adressDetailsForm = this.formBuilder.group({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      address_1: new FormControl('', Validators.required),
      address_2: new FormControl('', Validators.required),
      region_code: new FormControl(''),
      country: new FormControl(''),
      city: new FormControl('', Validators.required),
      postal_code: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
    this.viewState$ = this.facade.viewState$;
    // this.viewState$.subscribe((state) => {
    //   console.log(state);
    // });
    this.subscriptions.push(
      this.adressDetailsForm.valueChanges.subscribe((value: any) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  ngOnInit() {
    // this.store.dispatch(new AddressesActions.GetRegionList());
  }
  async onRegionCodeChange(regionId?: string) {
    // this.store.dispatch(new AddressesActions.GetCountries(regionId));
  }
  onCountryChange(country: any) {
    this.phoneNumberPlaceholder = this.buildPhoneNumberPlaceholder(country);
  }

  buildPhoneNumberPlaceholder(country: any): string {
    const string = new CountryPhone(country.iso_2, country.name);
    const phoneNumberPlaceholder = `${string.code} ${string.sample_phone}`;
    console.log(phoneNumberPlaceholder);

    return phoneNumberPlaceholder;
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.adressDetailsForm.reset();
    }
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  validate(_: FormControl) {
    return this.adressDetailsForm.valid ? null : this.adressDetailsForm.valid;
  }
  reset() {
    this.adressDetailsForm.reset();
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.reset();
  }
}
