import { User } from "../../entities/user.entity";

export interface IPostRegisterUserHandler {
  handleAsync(user: User, appData: object): Promise<User>;
}
