import { ErrorExtensions } from "../dto";

export class OtpLockedErrorExtensions extends ErrorExtensions {
  lockedAt: Date;
  constructor(lockedAt: Date) {
    super();
    this.lockedAt = lockedAt;
  }
}
