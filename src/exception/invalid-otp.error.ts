export class InvalidOtpError extends Error {
  constructor(message: string) {
    super(message);
  }
}
