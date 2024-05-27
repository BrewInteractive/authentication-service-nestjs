import { ErrorExtensions, ExtendedError } from "../dto";

import { appConfig } from "../config";

export class InvalidCredentialsError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "Invalid credentials.";
    this.extensions = {
      code: appConfig().errorCodePrefix + "003",
    };
  }
}
