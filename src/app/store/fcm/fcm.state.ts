import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { FcmActions } from './fcm.actions';
import { FcmService } from 'src/app/shared/services/fcm/fcm.service';

export class FcmStateModel {
    device_token: string;
    fcm_accepted: string;
}
@State<FcmStateModel>({
    name: 'fcm',
    defaults: {
        device_token: null,
        fcm_accepted: null,
    }
})
@Injectable()
export class FcmState {

    constructor(
        private fcmService: FcmService,
        private store: Store,
    ) { }

    @Action(FcmActions.GetFcmToken)
    getFcmToken(ctx: StateContext<FcmStateModel>) {
        const state = ctx.getState();

        this.fcmService.initPush()
            .then((v: any) => {
                console.log(v);
                // ctx.patchState({
                //     ...state,
                //     device_token: v?.device_token,
                //     fcm_accepted: v?.fcm_accepted,
                // });
            })
            .catch((e) => {
                console.error(e);
            });
    }

}
