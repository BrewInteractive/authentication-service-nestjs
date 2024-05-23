import { ErrorExtensions, ExtendedError } from "../dto";

export class InvalidArgumentError extends ExtendedError<ErrorExtensions> {
  constructor(message: string) {
    super(message);
    this.extensions = {
      code: "ERR002",
    };
  }
}
