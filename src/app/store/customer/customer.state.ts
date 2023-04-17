import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

export class ICustomer0StateModel { }
@State<ICustomer0StateModel>({
    name: 'customer',
})
@Injectable()
export class CustomerState {
}
