import { Injectable, inject } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { EmailPasswordActions } from './email-password.actions';
import { catchError, throwError } from 'rxjs';
import { AuthStateActions } from '../auth.actions';
import { IAuth0StateModel } from '../auth0/auth0.state';
import { EmailPasswordService } from './email-password.service';
import { UtilityService } from 'src/app/shared/services/utility/utility.service';

export class IEmailPasswordStateModel { }

@State<IEmailPasswordStateModel>({
    name: 'emailPassword',
})
@Injectable()
export class EmailPasswordState {

    private emailPasswordService = inject(EmailPasswordService);
    private store = inject(Store);
    private utility = inject(UtilityService);

    @Action(EmailPasswordActions.LoginEmailPassword)
    async loginEmailPassword(ctx: StateContext<IAuth0StateModel>, { email, password }: EmailPasswordActions.LoginEmailPassword) {
        console.log(email, password);
        this.utility.presentLoading('...');
        this.emailPasswordService.loginEmailPassword(email, password)
            .pipe(
                catchError(err => {
                    this.utility.dismissLoading();
                    return throwError(() => new Error(JSON.stringify(err)));
                })
            )
            .subscribe((user: any) => {
                if (user) {
                    this.store.dispatch(new AuthStateActions.SetAuthState(user));
                    this.utility.dismissLoading();
                }
            });
    }
}
