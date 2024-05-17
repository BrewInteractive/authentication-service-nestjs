import {
  Inject,
  Controller,
  Post,
  Body,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { SendLoginOtpEmailRequest } from "./dto/send-login-otp-email-request.dto";
import { OtpService } from "../otp/otp.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuthenticationAction } from "../enum";
import { SendLoginOtpEmailResponse } from "./dto/send-login-otp-email-response.dto";
import { InvalidCredentialsError } from "../error";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class SendLoginOtpEmailController {
  constructor(
    @Inject("UserService") private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post("send-login-otp-email")
  async sendLoginOtpEmailAsync(
    @Body() sendLoginOtpEmailRequest: SendLoginOtpEmailRequest
  ): Promise<SendLoginOtpEmailResponse> {
    try {
      const user = await this.userService.getUserAsync({
        email: sendLoginOtpEmailRequest.email,
      });

      if (!user) throw new InvalidCredentialsError();

      const sendOtpResult = await this.otpService.createEmailOtpAsync(
        sendLoginOtpEmailRequest.email
      );

      if (sendOtpResult.isSent === true) {
        this.eventEmitter.emit("otp.email.created", {
          otpValue: sendOtpResult.otpValue,
          emailAddress: sendLoginOtpEmailRequest.email,
          authenticationAction: AuthenticationAction.LOGIN,
        });
      }

      return {
        isSent: sendOtpResult.isSent,
        expiresAt: sendOtpResult.expiresAt,
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsError)
        throw new UnauthorizedException(null, { cause: error });
    }
  }
}
