import { ErrorExtensions, ExtendedError } from "../dto";

export class UserAlreadyExistsError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "User is already exists.";
    this.extensions = {
      code: "ERR_008",
    };
  }
}
