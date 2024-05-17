export class UserAlreadyExistsError extends Error {
  constructor() {
    super();
    this.message = "User is already exists.";
  }
}
