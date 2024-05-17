import { EmailService } from "../email/email.service";
import { Inject, Injectable } from "@nestjs/common";
import { TemplateService } from "../template/template.service";
import { OnEvent } from "@nestjs/event-emitter";
import { ConfigService } from "@nestjs/config";
import { OtpEmailCreatedEvent } from "./dto/otp-email-created-event.dto";
import { AuthenticationAction } from "../enum";
import { OtpEmailTemplateNotFoundError } from "./error";
import { ResetPasswordCreatedEvent } from "./dto";

@Injectable()
export class NotificationService {
  constructor(
    @Inject("TemplateService")
    private readonly templateService: TemplateService,
    @Inject("EmailService") private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {}

  @OnEvent("otp.email.created")
  async onOtpEmailCreatedAsync(
    otpEmailCreatedEvent: OtpEmailCreatedEvent
  ): Promise<void> {
    const email = this.getOtpEmailByAuthAction(
      otpEmailCreatedEvent.otpValue,
      otpEmailCreatedEvent.authenticationAction
    );

    if (email) {
      return await this.sendEmailAsync(
        email.subject,
        otpEmailCreatedEvent.emailAddress,
        email.content
      );
    }
  }

  @OnEvent("reset-password.email.created")
  async onResetPasswordEmailCreatedAsync(
    resetPasswordCreatedEvent: ResetPasswordCreatedEvent
  ): Promise<void> {
    const resetPasswordEmailTemplate =
      this.templateService.getResetPasswordEmailTemplate("en");

    const emailContent = this.templateService.injectData(
      resetPasswordEmailTemplate,
      {
        resetLink: resetPasswordCreatedEvent.resetLink,
      }
    );

    return await this.sendEmailAsync(
      this.configService.get("emailSubjects.resetPassword"),
      resetPasswordCreatedEvent.emailAddress,
      emailContent
    );
  }

  private getOtpEmailByAuthAction(
    otpValue: string,
    authenticationAction: AuthenticationAction
  ): { subject: string; content: string } {
    let template = null;
    if (authenticationAction === AuthenticationAction.LOGIN)
      template = this.templateService.getLoginOtpEmailTemplate("en");

    if (template == null)
      throw new OtpEmailTemplateNotFoundError(authenticationAction);

    return {
      content: this.templateService.injectData(template, {
        otpValue,
      }),
      subject: this.configService.get<string>("emailSubjects.loginOtp"),
    };
  }

  private async sendEmailAsync(
    subject: string,
    to: string,
    content: string
  ): Promise<void> {
    return await this.emailService.sendEmailAsync({
      from: this.configService.get<string>("emailFrom"),
      to,
      subject,
      content,
    });
  }
}
