export class OtpNotFoundError extends Error {
  constructor() {
    super();
    this.message = "Otp not found";
  }
}
