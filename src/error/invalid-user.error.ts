export class InvalidUserError extends Error {
  constructor() {
    super();
    this.message = "Invalid User.";
  }
}
