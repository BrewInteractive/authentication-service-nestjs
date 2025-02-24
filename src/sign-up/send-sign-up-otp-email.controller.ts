import {
  Inject,
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  ConflictException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { SendSignUpOtpEmailResponse, SendSignUpOtpEmailRequest } from "./dto";
import { OtpService } from "../otp/otp.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuthenticationAction } from "../enum";
import { UserAlreadyExistsError } from "../error";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class SendSignUpOtpEmailController {
  constructor(
    @Inject("UserService") private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post("send-sign-up-otp-email")
  async sendSignUpOtpEmailAsync(
    @Body() sendSignUpOtpEmailRequest: SendSignUpOtpEmailRequest
  ): Promise<SendSignUpOtpEmailResponse> {
    try {
      const user = await this.userService.getUserAsync({
        email: sendSignUpOtpEmailRequest.email,
      });

      if (user) {
        throw new UserAlreadyExistsError();
      }

      const sendOtpResult = await this.otpService.createEmailOtpAsync(
        sendSignUpOtpEmailRequest.email
      );

      if (sendOtpResult.isSent) {
        this.eventEmitter.emit("otp.email.created", {
          otpValue: sendOtpResult.otpValue,
          emailAddress: sendSignUpOtpEmailRequest.email,
          authenticationAction: AuthenticationAction.SIGNUP,
          locale: sendSignUpOtpEmailRequest?.locale,
          appData: sendSignUpOtpEmailRequest?.appData,
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
