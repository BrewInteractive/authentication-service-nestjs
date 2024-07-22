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
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { User } from "../entities";
import { SignUpOtpEmailRequest } from "./dto";

@ApiTags("authentication")
@ApiSecurity("ApiKey")
@Controller()
export class SignUpOtpEmailController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly otpService: OtpService,
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("sign-up-otp-email")
  async signUpAsync(
    @Body() signUpOtpEmailRequest: SignUpOtpEmailRequest
  ): Promise<SignUpResponse> {
    try {
      const haveUser = await this.userService.getUserAsync({
        email: signUpOtpEmailRequest.email,
      });

      if (haveUser) throw new UserAlreadyExistsError();

      const isOtpValid = await this.otpService.validateEmailOtpAsync(
        signUpOtpEmailRequest.email,
        signUpOtpEmailRequest.otpValue
      );

      if (!isOtpValid) throw new InvalidCredentialsError();

      this.otpService.expireOtpAsync({ email: signUpOtpEmailRequest.email });

      const userCandidate = await this.mapper.mapAsync(
        signUpOtpEmailRequest,
        SignUpOtpEmailRequest,
        User
      );
      userCandidate.emailVerified = true;

      const user = await this.userService.createUserAsync(
        userCandidate,
        signUpOtpEmailRequest.appData
      );

      return await this.tokenService.createTokensAsync(user);
    } catch (error) {
      if (error instanceof InvalidCredentialsError)
        throw new UnauthorizedException(null, { cause: error });
      if (error instanceof UserAlreadyExistsError)
        throw new UnauthorizedException(null, { cause: error });
      console.log("sign-up-otp-email", error);
      throw new InternalServerErrorException();
    }
  }
}
