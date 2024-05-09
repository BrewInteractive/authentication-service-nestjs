import { Inject, Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { SendLoginOtpEmailRequest } from "./dto/send-login-otp-email-request.dto";
import { OtpService } from "../otp/otp.service";
import { SendOtpResult } from "../otp/dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuthenticationAction } from "../enum";
import { OtpEmailCreatedEvent } from "../notification/dto/otp-email-created-event.dto";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class SendLoginOtpEmailController {
  constructor(
    @Inject("UserService") private readonly userService: UserService,
    @Inject("OtpService") private readonly otpService: OtpService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post("send-login-otp-email")
  async sendLoginOtpEmailAsync(@Body() sendLoginOtpEmailRequest: SendLoginOtpEmailRequest): Promise<SendOtpResult> {
    const user = await this.userService.getUserAsync({ email: sendLoginOtpEmailRequest.email });
    
    if(!user) throw new UnauthorizedException("User doesn't exist.");

    const sendOtpResult = await this.otpService.createEmailOtpAsync(sendLoginOtpEmailRequest.email);
    
    if(sendOtpResult.isSent === true) {
      const otpEmailCreatedEvent = new OtpEmailCreatedEvent();
      otpEmailCreatedEvent.otpValue = sendOtpResult.otpValue;
      otpEmailCreatedEvent.emailAddress = sendLoginOtpEmailRequest.email;
      otpEmailCreatedEvent.authenticationAction = AuthenticationAction.LOGIN;
      this.eventEmitter.emit("otp.email.created", otpEmailCreatedEvent);
    }

    return sendOtpResult;
  }
}
