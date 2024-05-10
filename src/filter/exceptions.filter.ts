import { ExceptionFilter, Catch, ArgumentsHost, HttpException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../dto/error-response.dto';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception instanceof HttpException ? exception.getStatus() : 500;

    const errorResponse = new ErrorResponse();
    errorResponse.message = exception.message

    if (exception instanceof UnauthorizedException) {
        status = 401;
    }
    if (exception instanceof BadRequestException) {
        errorResponse.message = exception.getResponse()['message'];
        status = 400;
    }

    response
      .status(status)
      .json(errorResponse);
  }
}
