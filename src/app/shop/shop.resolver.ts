import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { AddressesActions } from '../store/addresses/addresses.actions';

@Injectable({
    providedIn: 'root'
})
export class ShopResolver implements Resolve<Observable<any>> {
    private store = inject(Store);
    resolve(): Observable<any> {
        console.log('shop resolver get region list');
        return this.store.dispatch(new AddressesActions.GetRegionList());;
    }
}