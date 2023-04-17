import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

export class IUserStateModel { }

@State<IUserStateModel>({
    name: 'user',
})
@Injectable()
export class UserState {
}
