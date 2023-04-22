import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressesState } from 'src/app/store/addresses/addresses.state';
import { AuthState } from 'src/app/store/auth/auth.state';
import { CustomerState } from 'src/app/store/customer/customer.state';


@Injectable({
    providedIn: 'root'
})
export class AddressDetailsFacade {

    @Select(AddressesState.getRegionList) regionList$: Observable<any> | any;

    @Select(AddressesState.getCountryList) countryList$: Observable<any> | any;

    @Select(AuthState.getCustomer) customer$: Observable<any> | any;

    @Select(AddressesState.getSelectedAddress) selectedAddress$: Observable<any> | any;

    readonly viewState$: Observable<any>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.selectedAddress$,
                this.regionList$,
                this.countryList$,
                this.customer$,
            ]
        ).pipe(
            map((
                [
                    selectedAddress,
                    regionList = null,
                    countryList = null,
                    customer = null
                ]
            ) => ({
                selectedAddress,
                regionList,
                countryList,
                customer
            }))
        );
    }
}
