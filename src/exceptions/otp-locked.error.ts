import { ExtendedError } from "../dto";
import { OtpLockedErrorExtensions } from "./otp-locked-error.extension";

export class OtpLockedError extends ExtendedError<OtpLockedErrorExtensions> {
  constructor(lockedAt: Date) {
    super();
    this.message = "otp locked.";
    this.extensions = new OtpLockedErrorExtensions(lockedAt);
  }
}
