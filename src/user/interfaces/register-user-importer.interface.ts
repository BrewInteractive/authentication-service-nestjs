import { User } from "../../models/user.entity";

export interface IRegisterUserImporter {
  createUserAsync(user: User, appData: object): Promise<Boolean>;
}
