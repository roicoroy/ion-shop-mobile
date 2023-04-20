
export namespace MedusaActions {
    export class SecretKey {
        static readonly type = '[MedusaActions] Secret Key';
        constructor(public secretKey: string) { }
    }
    export class UnSetSecretKey {
        static readonly type = '[MedusaActions] UnSet Secret Key';
    }
    export class LogOut {
        static readonly type = '[MedusaActions] Logout, clear medusa state';
    }
}
