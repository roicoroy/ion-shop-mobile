import { Injectable } from "@angular/core";
import Medusa from "@medusajs/medusa-js";
import { State, Store, Selector, Action, StateContext } from "@ngxs/store";
import { environment } from "src/environments/environment";
import { MedusaActions } from "../medusa/medusa.actions";

export interface MedusaStateModel {
    secretKey: string;
}
export const initMedusaStateModel: MedusaStateModel = {
    secretKey: null,
};
@State({
    name: 'medusa',
    defaults: initMedusaStateModel,
})
@Injectable()
export class MedusaState {
    medusaClient: any;

    constructor() {
        this.medusaClient = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }
    @Selector()
    static getSecretKey(state: MedusaStateModel) {
        return state.secretKey;
    }
    @Action(MedusaActions.SecretKey)
    async secretKey(ctx: StateContext<MedusaStateModel>, { secretKey }: MedusaActions.SecretKey) {
        // console.log(secretKey);
        try {
            ctx.patchState({
                secretKey: secretKey,
            });
        }
        catch (err: any) {
            if (err) {
            }
        }
    }
    @Action(MedusaActions.UnSetSecretKey)
    async unSetSecretKey(ctx: StateContext<MedusaStateModel>): Promise<any> {
        try {
            return ctx.patchState({
                secretKey: null,
            });
        }
        catch (err: any) {
            if (err) {
            }
        }
    }
    @Action(MedusaActions.LogOut)
    logOut(ctx: StateContext<MedusaStateModel>) {
        ctx.patchState({
            secretKey: null,
        });
    }
}
