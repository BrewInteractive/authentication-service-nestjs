export class UserNotFoundError extends Error {
  constructor() {
    super();
    this.message = "Unauthorized";
  }
}
