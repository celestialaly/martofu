import type User from "../../domain/User";

export class UserRegisterModel {
    email: string;
    plainPassword: string;

    constructor(user: User) {
        this.email = user.email;
        this.plainPassword = user.plainPasword;
    }
}