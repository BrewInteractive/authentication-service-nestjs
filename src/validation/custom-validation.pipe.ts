import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common";

import { ExtendedError } from "../dto";
import { ValidationErrorExtensions } from "../error/error-extension/validation-error.extension";
import { appConfig } from "../config";

export class CustomValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const fields = validationErrors.map(
        (error) =>
          error.property +
          ": " +
          Object.values(error.constraints || {}).join(", ")
      );
      return new BadRequestException(null, {
        cause: {
          message: "Validation failed",
          extensions: {
            code: appConfig().errorCodePrefix + "009",
            fields,
          },
        } as ExtendedError<ValidationErrorExtensions>,
      });
    };
  }
}
