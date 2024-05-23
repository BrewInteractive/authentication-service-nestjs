import { ErrorExtensions, ExtendedError } from "../dto";

export class OtpNotFoundError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "Otp not found";
    this.extensions = {
      code: "ERR_006",
    };
  }
}
