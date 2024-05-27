import { ErrorExtensions, ExtendedError } from "../dto";

import { appConfig } from "../config";

export class UserAlreadyExistsError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "User is already exists.";
    this.extensions = {
      code: appConfig().errorCodePrefix + "008",
    };
  }
}
