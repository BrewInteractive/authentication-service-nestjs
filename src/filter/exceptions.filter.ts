import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";

import { AppHttpException } from "../exceptions/app.exception";
import { ErrorResponse } from "../dto/http-extension-response.dto";
import { ExtendedError } from "src/dto";
import { OtpLockedError } from "src/exceptions/otp-locked.error";
import { Response } from "express";
import { error } from "console";

@Catch(Error)
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

// todo: dictionary'den status code bul
    
    response.status(this.getStatusCode(exception)).json(errorResponse);
  }

  private getStatusCode(exception: Error): number {
    if (exception instanceof OtpLockedError) {
      return HttpStatus.UNAUTHORIZED;
    } else if (exception instanceof BadRequestException) {
      return HttpStatus.BAD_REQUEST;
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
