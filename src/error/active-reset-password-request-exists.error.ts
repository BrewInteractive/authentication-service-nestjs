import { ErrorExtensions, ExtendedError } from "../dto";

export class ActiveResetPasswordRequestExistsError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "Active reset password request exists.";
    this.extensions = {
      code: "ERR001",
    };
  }
}
