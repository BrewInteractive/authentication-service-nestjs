export class UserExistsError extends Error {
  constructor() {
    super();
    this.message = "User exists.";
  }
}
