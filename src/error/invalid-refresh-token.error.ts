export class InvalidRefreshTokenError extends Error {
  constructor() {
    super();
    this.message = "Invalid refresh Token.";
  }
}
