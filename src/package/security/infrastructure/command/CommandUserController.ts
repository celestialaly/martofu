import ApiController from "@/package/common/api/ApiController";
import User from '../../domain/User';
import type { UserModel } from "../UserModel";
import { UserRegisterModel } from "./UserRegisterModel";

export default class CommandUserController extends ApiController {
    async register(user: User): Promise<any> {
        await this.post<UserModel>('/register', new UserRegisterModel(user));
    }
}