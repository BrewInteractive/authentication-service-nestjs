import { ArgumentsHost, BadRequestException } from "@nestjs/common";
import {
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  InvalidResetPasswordRequestError,
  UserExistsError,
  UserNotFoundError,
} from "../error";

import { ErrorFilter } from "./error.filter";

describe("ErrorFilter", () => {
  let filter: ErrorFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: Response;

  beforeEach(() => {
    filter = new ErrorFilter();
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

  it("should handle Invalid Credentials Error", () => {
    const error = new InvalidCredentialsError();

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid credentials",
    });
  });

  it("should handle Invalid Reset Password Request Error", () => {
    const error = new InvalidResetPasswordRequestError("Test message");

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Test message",
    });
  });

  it("should handle Invalid Refresh Token Error", () => {
    const error = new InvalidRefreshTokenError();

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid refresh Token.",
    });
  });

  it("should handle User Not Found Error", () => {
    const error = new UserNotFoundError();

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Unauthorized",
    });
  });

  it("should handle User Exists Error", () => {
    const error = new UserExistsError();

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User exists.",
    });
  });

  it("should handle User Exists Error", () => {
    const error = new UserExistsError();

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User exists.",
    });
  });

  it("should handle Bad Request Exception", () => {
    const error = new BadRequestException();

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Bad Request",
    });
  });

  it("should handle other errors", () => {
    const error = new Error("Test message");

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Test message",
    });
  });
});
