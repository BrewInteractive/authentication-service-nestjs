export class InvalidResetPasswordRequestError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}
