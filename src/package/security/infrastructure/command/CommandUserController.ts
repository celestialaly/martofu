import ApiController from "@/package/common/api/ApiController";
import User from '../../domain/User';
import type { UserModel } from "../UserResponseModel";
import { UserRegisterModel } from "./UserRegisterModel";
import { UserLoginModel } from "./UserLoginModel";
import type { AuthResponseModel } from "./AuthResponseModel";
import ApiException from '../../../common/api/ApiException';
import { useToastStore } from "@/package/common/stores/toastStore";

export default class CommandUserController extends ApiController {
    async register(user: User): Promise<any> {
        return await this.post<UserModel>('/register', new UserRegisterModel(user));
    }

    async login(email: string, password: string): Promise<AuthResponseModel> {
        try {
            return await this.post<AuthResponseModel>('/auth', new UserLoginModel(email, password));
        } catch (error) {
            if (error instanceof ApiException && error.status == 401) {
                useToastStore().add({ severity: 'error', summary: `Erreur`, detail: 'Votre adresse email ou votre mot de passe est incorrect.', life: 3000 });
            }
        }
    }
}