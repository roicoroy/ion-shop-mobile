export namespace EmailPasswordActions {
    export class LoginEmailPassword {
        static readonly type = '[EmailPasswordActions] Login Email Password';
        constructor(public email: string, public password: string) { }
    }
}
