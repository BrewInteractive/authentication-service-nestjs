import { User } from "../../entities/user.entity";

export interface IUserValidator {
  validateAsync(user: User): Promise<boolean>;
}
