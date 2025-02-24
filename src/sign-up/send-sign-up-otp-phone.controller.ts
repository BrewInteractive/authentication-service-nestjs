import {
  Inject,
  Controller,
  Post,
  Body,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { OtpService } from "../otp/otp.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuthenticationAction } from "../enum";
import { UserAlreadyExistsError } from "../error";
import { SendSignUpOtpPhoneRequest } from "./dto/send-sign-up-otp-phone-request.dto";
import { SendSignUpOtpPhoneResponse } from "./dto/send-sign-up-otp-phone-response.dto";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class SendSignUpOtpPhoneController {
  constructor(
    @Inject("UserService") private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post("send-sign-up-otp-phone")
  async sendSignUpOtpPhoneAsync(
    @Body() sendSignUpOtpPhoneRequest: SendSignUpOtpPhoneRequest
  ): Promise<SendSignUpOtpPhoneResponse> {
    try {
      const user = await this.userService.getUserAsync({
        phone: sendSignUpOtpPhoneRequest.phone,
      });

      if (user) throw new UserAlreadyExistsError();

      const sendOtpResult = await this.otpService.createPhoneOtpAsync({
        phone_number: sendSignUpOtpPhoneRequest.phone.number,
        country_code: sendSignUpOtpPhoneRequest.phone.countryCode,
      });

      if (sendOtpResult.isSent === true) {
        this.eventEmitter.emit("otp.sms.created", {
          otpValue: sendOtpResult.otpValue,
          phoneNumber:
            sendSignUpOtpPhoneRequest.phone.countryCode +
            sendSignUpOtpPhoneRequest.phone.number,
          authenticationAction: AuthenticationAction.SIGNUP,
          locale: sendSignUpOtpPhoneRequest?.locale,
          appData: sendSignUpOtpPhoneRequest?.appData,
        });
      }

      return {
        isSent: sendOtpResult.isSent,
        expiresAt: sendOtpResult.expiresAt,
      };
    } catch (error) {
      if (error instanceof UserAlreadyExistsError)
        throw new ConflictException(null, { cause: error });

      throw new InternalServerErrorException();
    }
  }
}
