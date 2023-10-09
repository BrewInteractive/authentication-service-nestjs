import { User } from "../../models/user.entity";

export interface IPreRegisterUserHandler {
  handleAsync(user: User, appData: object): Promise<boolean>;
}
