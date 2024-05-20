export class ActiveResetPasswordRequestExistsError extends Error {
  constructor() {
    super();
    this.message = "Active reset password request exists.";
  }
}
