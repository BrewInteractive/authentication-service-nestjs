export class UserNotFoundError extends Error {
  constructor() {
    super();
    this.message = "User not found.";
  }
}
