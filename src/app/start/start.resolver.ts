import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { AddressesActions } from 'src/app/store/addresses/addresses.actions';

@Injectable({
    providedIn: 'root'
})
export class StartResolver implements Resolve<Observable<any>> {
    resolve(): Observable<any> {
        console.log('Start resolver')
        return null;
    }
}