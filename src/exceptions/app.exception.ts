import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorResponse } from "src/dto/error-response.dto";

export class AppHttpException extends HttpException {
  public readonly errorResponse: ErrorResponse;

  constructor(status: HttpStatus, _errorResponse: ErrorResponse) {
    super(_errorResponse.message, status);
    this.errorResponse = _errorResponse;
  }
}

export class AppException extends Error {
  public readonly errorResponse: ErrorResponse;

  constructor(_errorResponse: ErrorResponse) {
    super(_errorResponse.message);
    this.errorResponse = _errorResponse;
  }
}
