import { ErrorExtensions, ExtendedError } from "../dto";

import { appConfig } from "../config";

export class InvalidRefreshTokenError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "Invalid refresh token.";
    this.extensions = {
      code: appConfig().errorCodePrefix + "004",
    };
  }
}
