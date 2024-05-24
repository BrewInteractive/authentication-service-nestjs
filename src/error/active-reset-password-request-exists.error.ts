import { ErrorExtensions, ExtendedError } from "../dto";

import { appConfig } from "../config";

export class ActiveResetPasswordRequestExistsError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "Active reset password request exists.";

    this.extensions = {
      code: appConfig().errorCodePrefix + "001",
    };
  }
}
