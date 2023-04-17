import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

export class IErrorLoggingStateModel { }
@State<IErrorLoggingStateModel>({
    name: 'error-logging',
})
@Injectable()
export class ErrorLoggingState {
}
