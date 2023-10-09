import { User } from "../../models/user.entity";

export interface IPostRegisterUserHandler {
  handleAsync(user: User, appData: object): Promise<boolean>;
}
