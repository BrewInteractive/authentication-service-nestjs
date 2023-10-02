import { User } from "../../entities/user.entity";

export interface IRegisterUserImporter {
  createUserAsync(user: User, appData: object): Promise<boolean>;
}
