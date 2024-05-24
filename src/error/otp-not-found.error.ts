import { ErrorExtensions, ExtendedError } from "../dto";

import { appConfig } from "../config";

export class OtpNotFoundError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "Otp not found";
    this.extensions = {
      code: appConfig().errorCodePrefix + "006",
    };
  }
}
