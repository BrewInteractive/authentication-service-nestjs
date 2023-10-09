import { User } from "../../entities/user.entity";

export interface IValidateUserImporter {
  validateUserAsync(user: User): Promise<boolean>;
}
