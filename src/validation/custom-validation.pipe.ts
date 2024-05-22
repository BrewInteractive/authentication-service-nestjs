import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common";
import { ValidationErrorExtensions } from "../error/error-extension/validation-error.extention";
import { ExtendedError } from "../dto";

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
            fields,
          },
        } as ExtendedError<ValidationErrorExtensions>,
      });
    };
  }
}
