import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  Response,
  UnauthorizedException,
} from "@nestjs/common";

import { ErrorResponse } from "../dto/http-extension-response.dto";
import { ExceptionsFilter } from "./exceptions.filter";

describe("ExceptionsFilter", () => {
  let filter: ExceptionsFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: Response;

  beforeEach(() => {
    filter = new ExceptionsFilter();
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

  it("should handle HttpException", () => {
    const mockHttpException = new HttpException("Test HttpException", 404);

    filter.catch(mockHttpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Test HttpException",
    });
  });

  it("should handle UnauthorizedException", () => {
    const mockUnauthorizedException = new UnauthorizedException(
      "Test UnauthorizedException"
    );

    filter.catch(mockUnauthorizedException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Test UnauthorizedException",
    });
  });

  it("should handle BadRequestException", () => {
    const mockBadRequestException = new BadRequestException(
      "Test BadRequestException"
    );
    mockBadRequestException.getResponse = jest.fn().mockReturnValue({
      message: "Test validation errors",
    });

    filter.catch(mockBadRequestException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Test validation errors",
    });
  });

  it("should handle other types of exceptions", () => {
    const mockOtherException = new Error("Test other exception");

    filter.catch(mockOtherException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Test other exception",
    });
  });
});
