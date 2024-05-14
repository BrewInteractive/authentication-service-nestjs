import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  Response,
  UnauthorizedException,
} from "@nestjs/common";
import { ExceptionsFilter } from "./exceptions.filter";
import { InvalidCredentialsError } from "../exception/invalid-credentials.error";
import { UserExistsError } from "../exception/user-exists.error";
import { InvalidResetPasswordRequestError } from "../exception/invalid-reset-password-request.error";
import { InvalidRefreshTokenError } from "../exception/invalid-refresh-token.error";
import { InvalidOtpError } from "../exception/invalid-otp.error";
import { UserNotFoundError } from "../exception/user-not-found.error";

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

  it("should handle Invalid Credentials Error", () => {
    const mockHttpException = new InvalidCredentialsError();

    filter.catch(mockHttpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid credentials",
    });
  });

  it("should handle Invalid Reset Password Request Error", () => {
    const mockHttpException = new InvalidResetPasswordRequestError(
      "Test message"
    );

    filter.catch(mockHttpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Test message",
    });
  });

  it("should handle Invalid Refresh Token Error", () => {
    const mockHttpException = new InvalidRefreshTokenError();

    filter.catch(mockHttpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid refresh Token.",
    });
  });

  it("should handle Invalid Otp Error", () => {
    const mockHttpException = new InvalidOtpError("Test message");

    filter.catch(mockHttpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Test message",
    });
  });

  it("should handle User Not Found Error", () => {
    const mockHttpException = new UserNotFoundError();

    filter.catch(mockHttpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Unauthorized",
    });
  });

  it("should handle User Exists Error", () => {
    const mockHttpException = new UserExistsError();

    filter.catch(mockHttpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User exists.",
    });
  });

  it("should handle User Exists Error", () => {
    const mockHttpException = new UserExistsError();

    filter.catch(mockHttpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User exists.",
    });
  });

  it("should handle Bad Request Exception", () => {
    const mockHttpException = new BadRequestException();

    filter.catch(mockHttpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Bad Request",
    });
  });

  it("should handle other errors", () => {
    const mockHttpException = new Error("Test message");

    filter.catch(mockHttpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Test message",
    });
  });
});
