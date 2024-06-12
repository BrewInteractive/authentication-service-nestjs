import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginResponse } from "./dto/login-response.dto";
import { OtpService } from "../otp/otp.service";
import { UserService } from "../user/user.service";
import { TokenService } from "../token/token.service";
import { InvalidCredentialsError } from "../error";
import { LoginOtpPhoneRequest } from "./dto/login-otp-phone-request.dto";

@ApiTags("authentication")
@ApiSecurity("ApiKey")
@Controller()
export class LoginOtpPhoneController {
  constructor(
    private readonly otpService: OtpService,
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("login-otp-phone")
  async loginAsync(
    @Body() loginOtpPhoneRequest: LoginOtpPhoneRequest
  ): Promise<LoginResponse> {
    try {
      const phone = {
        country_code: loginOtpPhoneRequest.phone.countryCode,
        phone_number: loginOtpPhoneRequest.phone.number,
      };

      const isOtpValid = await this.otpService.validatePhoneOtpAsync(
        phone,
        loginOtpPhoneRequest.otpValue
      );

      if (!isOtpValid) throw new InvalidCredentialsError();

      const user = await this.userService.getUserAsync({
        phone: loginOtpPhoneRequest.phone,
      });

      if (!user) throw new InvalidCredentialsError();

      this.otpService.expireOtpAsync({
        phone,
      });

      return await this.tokenService.createTokensAsync(user);
    } catch (error) {
      if (error instanceof InvalidCredentialsError)
        throw new UnauthorizedException(null, { cause: error });
      console.log("login-otp-phone", error);
      throw new InternalServerErrorException();
    }
  }
}
