import { EmailService } from "../email/email.service";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { TemplateService } from "../template/template.service";
import { OnEvent } from "@nestjs/event-emitter";
import { ConfigService } from "@nestjs/config";
import { OtpEmailCreatedEvent } from "./dto/otp-email-created-event.dto";
import { EAuthenticationAction } from "../enums";

@Injectable()
export class NotificationService {
  constructor(
    @Inject("TemplateService")
    private readonly templateService: TemplateService,
    @Inject("EmailService") private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {}

  private getOtpTemplateByAuthenticationAction(
    authenticationAction: EAuthenticationAction
  ): {
    content: string;
    subject: string;
  } {
    if (authenticationAction === EAuthenticationAction.EMAIL_LOGIN_OTP)
      return {
        content: this.templateService.getLoginOtpEmailTemplate("en"),
        subject: this.configService.get<string>("emailSubjects.loginOtp"),
      };
    else throw new BadRequestException("There is no otp template.");
  }

  private generateEmailOtpTemplate(
    otpCode: string,
    authenticationAction: EAuthenticationAction
  ): {
    content: string;
    subject: string;
  } {
    const emailTemplate =
      this.getOtpTemplateByAuthenticationAction(authenticationAction);
    emailTemplate.content = this.templateService.injectData(
      emailTemplate.content,
      {
        otpCode,
      }
    ) as string;
    return emailTemplate;
  }

  @OnEvent("otp.email.created")
  async onOtpEmailCreated(
    otpEmailCreatedEvent: OtpEmailCreatedEvent
  ): Promise<void> {
    const emailContentTemplate = this.generateEmailOtpTemplate(
      otpEmailCreatedEvent.otpCode,
      otpEmailCreatedEvent.authenticationAction
    );

    await this.emailService.sendEmailAsync({
      from: this.configService.get<string>("emailFrom"),
      to: otpEmailCreatedEvent.userEmailAddress,
      subject: emailContentTemplate.subject,
      content: emailContentTemplate.content,
    });
  }
}
