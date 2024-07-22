import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { SignUpResponse } from "./dto/sign-up-response.dto";
import { OtpService } from "../otp/otp.service";
import { UserService } from "../user/user.service";
import { TokenService } from "../token/token.service";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../error";
import { User } from "../entities";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { SignUpOtpPhoneRequest } from "./dto";

@ApiTags("authentication")
@ApiSecurity("ApiKey")
@Controller()
export class SignUpOtpPhoneController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly otpService: OtpService,
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("sign-up-otp-phone")
  async signUpAsync(
    @Body() signUpOtpPhoneRequest: SignUpOtpPhoneRequest
  ): Promise<SignUpResponse> {
    try {
      const phone = {
        country_code: signUpOtpPhoneRequest.phone.countryCode,
        phone_number: signUpOtpPhoneRequest.phone.number,
      };

      const haveUser = await this.userService.getUserAsync({
        phone: signUpOtpPhoneRequest.phone,
      });

      if (haveUser) throw new UserAlreadyExistsError();

      const isOtpValid = await this.otpService.validatePhoneOtpAsync(
        phone,
        signUpOtpPhoneRequest.otpValue
      );

      if (!isOtpValid) throw new InvalidCredentialsError();

      this.otpService.expireOtpAsync({
        phone,
      });

      const userCandidate = await this.mapper.mapAsync(
        signUpOtpPhoneRequest,
        SignUpOtpPhoneRequest,
        User
      );
      userCandidate.phoneVerified = true;

      const user = await this.userService.createUserAsync(
        userCandidate,
        signUpOtpPhoneRequest.appData
      );

      return await this.tokenService.createTokensAsync(user);
    } catch (error) {
      if (error instanceof InvalidCredentialsError)
        throw new UnauthorizedException(null, { cause: error });
      if (error instanceof UserAlreadyExistsError)
        throw new UnauthorizedException(null, { cause: error });
      console.log("sign-up-otp-phone", error);
      throw new InternalServerErrorException();
    }
  }
}
