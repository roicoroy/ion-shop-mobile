import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthStateActions } from '../store/auth/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class CheckoutResolver implements Resolve<Observable<any>> {
    private store = inject(Store);
    resolve(): Observable<any> {
        return this.store.dispatch(new AuthStateActions.LoadApp());
    }
}