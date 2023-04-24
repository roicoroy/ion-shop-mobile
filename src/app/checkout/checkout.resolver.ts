import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { AddressesActions } from '../store/addresses/addresses.actions';
import { AuthStateActions } from '../store/auth/auth.actions';
import { CartActions } from '../store/cart/cart.actions';
import { ProductsActions } from '../store/products/products.actions';

@Injectable({
    providedIn: 'root'
})
export class CheckoutResolver implements Resolve<Observable<any>> {
    private store = inject(Store);
    resolve(): Observable<any> {
        console.log('checkouyt resolve')
        return this.store.dispatch(new AuthStateActions.LoadApp());
    }
}