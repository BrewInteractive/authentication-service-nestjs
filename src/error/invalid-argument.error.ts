import { ErrorExtensions, ExtendedError } from "../dto";

import { appConfig } from "../config";

export class InvalidArgumentError extends ExtendedError<ErrorExtensions> {
  constructor(message: string) {
    super(message);
    this.extensions = {
      code: appConfig().errorCodePrefix + "002",
    };
  }
}
