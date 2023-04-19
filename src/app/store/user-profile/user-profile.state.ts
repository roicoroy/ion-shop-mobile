import { Injectable, inject } from "@angular/core";
import { State, Action, StateContext, Store } from "@ngxs/store";
import { UserProfileActions } from "./user-profile.actions";
import { UserProfileStateService } from "./user-profile.service";
import { NgForm } from "@angular/forms";

export class UserProfileModel {
    isDarkMode: boolean;
    fcmAccepted: boolean;
    userForm: NgForm
}

@State<UserProfileModel>({
    name: 'userProfile',
    defaults: {
        isDarkMode: null,
        fcmAccepted: null,
        userForm: null
    }
})
@Injectable()
export class UserProfileState {

    private store = inject(Store);
    private service = inject(UserProfileStateService);

    @Action(UserProfileActions.UpdateDarkMode)
    updateDarkMode(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UpdateDarkMode): void {
        ctx.patchState({
            isDarkMode: action.isDarkMode,
        });
    }
    @Action(UserProfileActions.UpdateFcmAccepted)
    updateFcmAccepted(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UpdateFcmAccepted): void {
        ctx.patchState({
            isDarkMode: action.fcmAccepted,
        });
    }
    @Action(UserProfileActions.UpdateStrapiUser)
    async updateStrapiUser(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UpdateStrapiUser): Promise<void> {
        console.log(action);
        const state = ctx.getState();
        console.log(state);
        const userId = await this.store.selectSnapshot<any>((state: any) => state.authState?.userId);
        console.log(userId);
        // if (userId) {
        //     this.service.updateStrapiUserProfile(userId, action.userForm)
        //         .subscribe((result) => {
        //             console.log("result", result);
        //         });
        // }
        // this.store.dispatch(new AuthStateActions.getMedusaSession());
        // this.store.dispatch(new AuthStateActions.GetCustomer());
    }
    @Action(UserProfileActions.UploadImage)
    uploadImage(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UploadImage): void {
        console.log(action);
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.userId);
        this.service.uploadData(action.imageForm, userId);
        // this.service.uploadStrapiImageToServer(action.imageForm)
        //     .subscribe((response: any) => {
        //         if (response) {
        //             const fileId = response[0].id;
        //             this.service.setProfileImage(userId, fileId);
        //             this.store.dispatch(new AuthStateActions.getMedusaSession());
        //             this.store.dispatch(new AuthStateActions.GetCustomer());
        //         }
        //     });
    }
}
