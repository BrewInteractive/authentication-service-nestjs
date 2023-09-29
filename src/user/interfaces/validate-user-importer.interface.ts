import { User } from "../../models/user.entity";

export interface IValidateUserImporter {
  validateUserAsync(user: User): Promise<boolean>;
}
