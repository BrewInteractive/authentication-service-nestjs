import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import {
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginOtpEmailRequest } from "./dto/login-otp-email-request.dto";
import { LoginResponse } from "./dto/login-response.dto";
import { OtpService } from "../otp/otp.service";
import { UserService } from "../user/user.service";
import { TokenService } from "../token/token.service";
import { InvalidCredentialsError } from "../error";

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
  async loginAsync(
    @Body() loginOtpEmailRequest: LoginOtpEmailRequest
  ): Promise<LoginResponse> {
    try {
      const isOtpValid = await this.otpService.validateEmailOtpAsync(
        loginOtpEmailRequest.email,
        loginOtpEmailRequest.otpValue
      );

      if (!isOtpValid) throw new InvalidCredentialsError();

      const user = await this.userService.getUserAsync({
        email: loginOtpEmailRequest.email,
      });

      if (!user) throw new InvalidCredentialsError();

      this.otpService.expireOtpAsync({ email: loginOtpEmailRequest.email });

      return await this.tokenService.createTokensAsync(user);
    } catch (error) {
      if (error instanceof InvalidCredentialsError)
        throw new UnauthorizedException(null, { cause: error });
    }
  }
}
