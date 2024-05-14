export class InvalidOtpError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}
