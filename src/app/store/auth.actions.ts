import { IUser } from "../shared/types/models/User";

export namespace AuthActions {
    export class GetUser {
        static readonly type = '[AuthActions] Get';
    }
    export class SetUser {
        static readonly type = '[AuthActions] Set user on state';
        constructor(public payload) { }
    }
    export class SetUploadedUser {
        static readonly type = '[AuthActions] Set uploaded User';
        constructor(public payload) { }
    }
    export class LogOutUser {
        static readonly type = '[AuthActions] Out';
    }
    export class PatchFormProfileFormStateWithSelectedRegion {
        static readonly type = '[AuthActions] Patch Profile form State with Selected Region';
        constructor(public selectedRegion: any) { }
    }
    export class UpdateStrapiUser {
        static readonly type = '[AuthActions] Update Strapi User';
        constructor(public userId?: string, public profileForm?: any) { }
    }
    export class SetIdToken {
        static readonly type = '[AuthActions] Set User Strapi Id and Token';
        constructor(public userId: string, public token: string) { }
    }
    export class LoadUser {
        static readonly type = '[AuthActions] Load User';
        constructor(public userId: string) { }
    }
}
