import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import { Body, Controller, Inject, Post, UseFilters } from "@nestjs/common";
import { LoginOtpEmailRequest } from "./dto/login-otp-email-request.dto";
import { LoginResponse } from "./dto/login-response.dto";
import { OtpService } from "../otp/otp.service";
import { UserService } from "../user/user.service";
import { TokenService } from "../token/token.service";
import { InvalidOtpError } from "../exception/invalid-otp.error";
import { ErrorFilter } from "../filter/error.filter";

@ApiTags("authentication")
@ApiSecurity("ApiKey")
@Controller()
export class LoginOtpEmailController {
  constructor(
    private readonly otpService: OtpService,
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("login-otp-email")
  @UseFilters(new ErrorFilter())
  async loginAsync(
    @Body() loginOtpEmailRequest: LoginOtpEmailRequest
  ): Promise<LoginResponse> {
    const isOtpValid = await this.otpService.validateEmailOtpAsync(
      loginOtpEmailRequest.email,
      loginOtpEmailRequest.otpValue
    );

    if (!isOtpValid) throw new InvalidOtpError("Invalid credentials");

    const user = await this.userService.getUserAsync({
      email: loginOtpEmailRequest.email,
    });

    if (!user) throw new InvalidOtpError("Invalid credentials");

    return await this.tokenService.createTokensAsync(user);
  }
}
