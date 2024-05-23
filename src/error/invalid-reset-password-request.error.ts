import { ErrorExtensions, ExtendedError } from "../dto";

export class InvalidResetPasswordRequestError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "Invalid reset password request.";
    this.extensions = {
      code: "ERR005",
    };
  }
}
