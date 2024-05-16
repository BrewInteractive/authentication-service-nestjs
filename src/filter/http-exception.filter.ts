import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

import { ErrorResponse } from "../dto/error-response.dto";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorResponse = new ErrorResponse();
    errorResponse.message = this.getExceptionMessage(exception);

    if (exception.cause) {
      if (exception.cause["message"])
        errorResponse.message = exception.cause.message;
      if (exception.cause["extensions"])
        errorResponse.extensions = exception.cause["extensions"];
    }
    response.status(status).json(errorResponse);
  }

  private getExceptionMessage(exception: HttpException) {
    const errorResponse = exception.getResponse();
    return errorResponse["message"] || exception.message;
  }
}
