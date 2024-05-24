import { ErrorExtensions, ExtendedError } from "../dto";

import { appConfig } from "../config";

export class InvalidResetPasswordRequestError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "Invalid reset password request.";
    this.extensions = {
      code: appConfig().errorCodePrefix + "005",
    };
  }
}
