import {
  Inject,
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { LoginRequest } from "./dto/login-request.dto";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { TokenService } from "../token/token.service";
import { LoginResponse } from "./dto/login-response.dto";
import { ErrorResponse } from "src/dto/error-response.dto";
import { AppException, AppHttpException } from "src/exceptions/app.exception";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class LoginController {
  constructor(
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("login")
  async loginAsync(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    try {
      if (loginRequest.email) delete loginRequest.username;

      const user = await this.userService.validateUserAsync({
        username: loginRequest.username,
        email: loginRequest.email,
        password: loginRequest.password,
      });

      const tokens = await this.tokenService.createTokensAsync(user);
      return tokens;
    } catch (exception) {
      if (exception instanceof AppException) {
        const e = exception as AppException;
        throw new AppHttpException(HttpStatus.ACCEPTED, e.errorResponse);
      }
    }
  }
}
