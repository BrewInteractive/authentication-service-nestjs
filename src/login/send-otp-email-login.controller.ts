import { Inject, Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { SendLoginOtpEmailRequest } from "./dto/send-login-otp-email-request.dto";
import { OtpService } from "../otp/otp.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuthenticationAction } from "../enum";
import { SendLoginOtpEmailResponse } from "./dto/send-login-otp-email-response.dto";

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
  async sendLoginOtpEmailAsync(@Body() sendLoginOtpEmailRequest: SendLoginOtpEmailRequest):
   Promise<SendLoginOtpEmailResponse> {
    const user = await this.userService.getUserAsync({ email: sendLoginOtpEmailRequest.email });

    if(!user) throw new UnauthorizedException("User doesn't exist.");

    const sendOtpResult = await this.otpService.createEmailOtpAsync(sendLoginOtpEmailRequest.email);

    if(sendOtpResult.isSent === true) {
      this.eventEmitter.emit("otp.email.created", {
        otpValue: sendOtpResult.otpValue,
        emailAddress: sendLoginOtpEmailRequest.email,
        authenticationAction: AuthenticationAction.LOGIN,
      });
    }

    return {
      is_sent: sendOtpResult.isSent,
      expires_at: sendOtpResult.expiresAt
    };
  }
}