import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";

import { ErrorExtensionsFixture } from "../../test/fixtures/dto/error-extensions.fixture";
import { ErrorResponse } from "../dto/error-response.dto";
import { ExtendedErrorFixture } from "../../test/fixtures/dto/extended-error.fixture";
import { HttpExceptionFilter } from "./http-exception.filter";
import { MockFactory } from "mockingbird";
import { Response } from "express";

describe("HttpExceptionFilter", () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: Response;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle exceptions without cause correctly", () => {
    const exceptionMessage = "Exception Message";
    const status = HttpStatus.BAD_REQUEST;

    const exception = new HttpException(exceptionMessage, status);

    filter.catch(exception, mockArgumentsHost);

    const expectedResponse = new ErrorResponse();
    expectedResponse.message = exceptionMessage;
    expect(mockResponse.status).toHaveBeenCalledWith(status);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should handle HttpExceptions with cause correctly", () => {
    const causeMessage = "Cause Message";
    const exceptionMessage = "Exception Message";
    const status = HttpStatus.BAD_REQUEST;

    const cause = new Error(causeMessage);
    const exception = new HttpException(exceptionMessage, status, { cause });

    filter.catch(exception, mockArgumentsHost);

    const expectedResponse = new ErrorResponse();
    expectedResponse.message = causeMessage;

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should handle UnauthorizedException with cause correctly", () => {
    const causeMessage = "Cause Message";
    const exceptionMessage = "Exception Message";
    const status = HttpStatus.UNAUTHORIZED;

    const cause = new Error(causeMessage);
    const exception = new UnauthorizedException(null, { cause });

    filter.catch(exception, mockArgumentsHost);

    const expectedResponse = new ErrorResponse();
    expectedResponse.message = causeMessage;

    expect(mockResponse.status).toHaveBeenCalledWith(status);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("should handle exceptions with cause that is an ExtendedError", () => {
    const extendedErrorMessage = "Extended Error message";
    const extendedErrorCode = "ERR123";
    const extendedErrorAdditionalProperty = "Additional info";
    const exceptionMessage = "Exception Message";
    const status = HttpStatus.BAD_REQUEST;

    const extensions = MockFactory(ErrorExtensionsFixture)
      .mutate({
        code: extendedErrorCode,
        additionalProperty: extendedErrorAdditionalProperty,
      })
      .one();

    const cause = MockFactory(ExtendedErrorFixture)
      .mutate({
        message: extendedErrorMessage,
        extensions: extensions,
      })
      .one();

    const exception = new HttpException(exceptionMessage, status, { cause });

    filter.catch(exception, mockArgumentsHost);

    const expectedResponse = new ErrorResponse();
    expectedResponse.message = extendedErrorMessage;
    expectedResponse.extensions = extensions;

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });
});
