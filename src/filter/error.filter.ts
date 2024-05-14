import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";

import { ErrorResponse } from "../dto/error-response.dto";
import { ExtendedError } from "../dto";
import { InvalidCredentialsError } from "../error/invalid-credentials.error";
import { InvalidOtpError } from "../error/invalid-otp.error";
import { InvalidRefreshTokenError } from "../error/invalid-refresh-token.error";
import { InvalidResetPasswordRequestError } from "../error/invalid-reset-password-request.error";
import { Response } from "express";
import { UserExistsError } from "../error/user-exists.error";
import { UserNotFoundError } from "../error/user-not-found.error";

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BadRequestException)
      return this.handleBadRequestException(exception, response);

    const errorResponse = new ErrorResponse();
    errorResponse.message = exception.message;

    if (exception instanceof ExtendedError) {
      errorResponse.extensions = exception.extensions;
    }

    response.status(this.getStatusCode(exception)).json(errorResponse);
  }

  private getStatusCode(exception: Error): number {
    if (
      exception instanceof InvalidCredentialsError ||
      exception instanceof InvalidResetPasswordRequestError ||
      exception instanceof InvalidRefreshTokenError ||
      exception instanceof InvalidOtpError ||
      exception instanceof UserNotFoundError
    ) {
      return HttpStatus.UNAUTHORIZED;
    } else if (exception instanceof UserExistsError) {
      return HttpStatus.CONFLICT;
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private handleBadRequestException(
    exception: BadRequestException,
    response: Response
  ) {
    const message = exception.getResponse()["message"];
    const errorResponse = new ErrorResponse();
    errorResponse.message = message;

    return response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
