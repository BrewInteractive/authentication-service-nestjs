import { User } from "../../entities/user.entity";

export interface IPreRegisterUserHandler {
  handleAsync(user: User, appData: object): Promise<User>;
}
