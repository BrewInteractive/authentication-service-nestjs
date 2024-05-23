import { ErrorExtensions, ExtendedError } from "../dto";

export class InvalidRefreshTokenError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "Invalid refresh token.";
    this.extensions = {
      code: "ERR_004",
    };
  }
}
