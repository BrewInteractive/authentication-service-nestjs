import {
  Inject,
  Controller,
  Post,
  Body,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginRequest } from "./dto/login-request.dto";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { TokenService } from "../token/token.service";
import { LoginResponse } from "./dto/login-response.dto";
import { InvalidCredentialsError } from "../error";

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

      return await this.tokenService.createTokensAsync(user);
    } catch (error) {
      if (error instanceof InvalidCredentialsError)
        throw new UnauthorizedException(null, { cause: error });
    }
  }
}
