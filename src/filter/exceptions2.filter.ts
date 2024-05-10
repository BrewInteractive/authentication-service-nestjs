import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

import { AppHttpException } from "../exceptions/app.exception";
import { ErrorResponse } from "../dto/error-response.dto";
import { ExtendedError } from "src/dto";
import { Response } from "express";
import { error } from "console";

// todo: bunu kullanmayacağız

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorResponse = new ErrorResponse();
    errorResponse.message = exception.message;

    if (exception.cause instanceof ExtendedError) {
      errorResponse.extensions = exception.cause["extensions"];
    }

    response.status(status).json(errorResponse);
  }
}
