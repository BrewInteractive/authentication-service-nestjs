import { Inject, Controller, Post, Body, UseFilters } from "@nestjs/common";
import { LoginRequest } from "./dto/login-request.dto";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { TokenService } from "../token/token.service";
import { LoginResponse } from "./dto/login-response.dto";
import { ExceptionsFilter } from "../filter/exceptions.filter";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
@UseFilters(new ExceptionsFilter())
export class LoginController {
  constructor(
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("login")
  async loginAsync(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    if (loginRequest.email) delete loginRequest.username;

    const user = await this.userService.validateUserAsync({
      username: loginRequest.username,
      email: loginRequest.email,
      password: loginRequest.password,
    });

    const tokens = await this.tokenService.createTokensAsync(user);
    return tokens;
  }
}
