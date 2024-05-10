import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { AppHttpException } from "../exceptions/app.exception";
import { ErrorResponse } from "../dto/error-response.dto";
import { error } from "console";
import { ExtendedError } from "src/dto";

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // let errorResponse = new ErrorResponse();
    // let status = exception.getStatus();

    // if (exception instanceof AppHttpException) {
    //   const appException = exception as AppHttpException;
    //   errorResponse = appException.errorResponse;
    // } else {
    //   errorResponse.message = exception.message;
    // }

    const errorResponse = new ErrorResponse();
    errorResponse.message = exception.message;

    if (exception instanceof ExtendedError) {
      errorResponse.extensions = exception.extensions;
    }

    response.status(status).json(errorResponse);
  }
}
