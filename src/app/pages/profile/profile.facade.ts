import { Injectable } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable, combineLatest, map } from "rxjs";
import { AuthState } from "src/app/store/auth/auth.state";

export interface IProfileStateModel {

}
@Injectable({
    providedIn: 'root'
})
export class ProfileFacade {
    @Select(AuthState.getUser) user$: Observable<any>;

    readonly viewState$: Observable<IProfileStateModel>;

    constructor(
        private store: Store
    ) {
        this.viewState$ = combineLatest(
            [
                this.user$
            ]
        ).pipe(
            map(([
                user
            ]) => ({
                user
            }))
        );
    }
}
