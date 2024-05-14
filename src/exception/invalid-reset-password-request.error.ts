export class InvalidResetPasswordRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}
