export class InvalidResetPasswordRequestError extends Error {
  constructor() {
    super();
    this.message = "Invalid reset password request.";
  }
}
