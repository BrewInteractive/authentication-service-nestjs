export class InvalidCredentialsError extends Error {
  constructor() {
    super();
    this.message = "Invalid credentials";
  }
}
