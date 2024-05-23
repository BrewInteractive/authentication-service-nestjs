import { ErrorExtensions, ExtendedError } from "../dto";

export class InvalidCredentialsError extends ExtendedError<ErrorExtensions> {
  constructor() {
    super();
    this.message = "Invalid credentials.";
    this.extensions = {
      code: "ERR003",
    };
  }
}
