import {
  Inject,
  Controller,
  Post,
  Body,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { OtpService } from "../otp/otp.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuthenticationAction } from "../enum";
import { InvalidCredentialsError } from "../error";
import { SendLoginOtpPhoneRequest } from "./dto/send-login-otp-phone-request.dto";
import { SendLoginOtpPhoneResponse } from "./dto/send-login-otp-phone-response.dto";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class SendLoginOtpPhoneController {
  constructor(
    @Inject("UserService") private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post("send-login-otp-phone")
  async sendLoginOtpPhoneAsync(
    @Body() sendLoginOtpPhoneRequest: SendLoginOtpPhoneRequest
  ): Promise<SendLoginOtpPhoneResponse> {
    try {
      const user = await this.userService.getUserAsync({
        phone: sendLoginOtpPhoneRequest.phone,
      });

      if (!user) throw new InvalidCredentialsError();

      const sendOtpResult = await this.otpService.createPhoneOtpAsync({
        phone_number: sendLoginOtpPhoneRequest.phone.phoneNumber,
        country_code: sendLoginOtpPhoneRequest.phone.countryCode,
      });

      if (sendOtpResult.isSent === true) {
        this.eventEmitter.emit("otp.sms.created", {
          otpValue: sendOtpResult.otpValue,
          phoneNumber:
            sendLoginOtpPhoneRequest.phone.countryCode +
            sendLoginOtpPhoneRequest.phone.phoneNumber,
          authenticationAction: AuthenticationAction.LOGIN,
        });
      }

      return {
        isSent: sendOtpResult.isSent,
        expiresAt: sendOtpResult.expiresAt,
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsError)
        return this.otpService.createFakeOtpResult();

      throw error;
    }
  }
}
