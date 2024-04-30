import { EmailService } from "../email/email.service";
import { Inject, Injectable } from "@nestjs/common";
import { TemplateService } from "../template/template.service";
import { OnEvent } from "@nestjs/event-emitter";
import { ConfigService } from "@nestjs/config";
import { Email } from "../email/dto/email.dto";

@Injectable()
export class NotificationService {
  constructor(
    @Inject("TemplateService")
    private readonly templateService: TemplateService,
    @Inject("EmailService") private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {}

  @OnEvent("reset-password.email.created")
  async onEmailResetPasswordAsync({
    resetPasswordKey,
    userEmailAddress,
  }: {
    resetPasswordKey: string;
    userEmailAddress: string;
  }): Promise<void> {
    const template = this.templateService.getResetPasswordEmailTemplate("en");
    const html = this.templateService.injectData(template, {
      resetLink:
        this.configService.get<string>("emailResetPasswordEndpoint") +
        `?emailAddress=${userEmailAddress}&resetPasswordKey=${resetPasswordKey}`,
    });
    const email = {
      from: this.configService.get<string>("emailFrom"),
      to: userEmailAddress,
      subject: this.configService.get<string>("emailSubjects.resetPassword"),
      content: html,
    } as Email;
    await this.emailService.sendEmailAsync(email);
  }

  @OnEvent("otp.login.email.created")
  async onLoginOtpEmailCreated({
    otpValue,
    userEmailAddress,
  }: {
    otpValue: string;
    userEmailAddress: string;
  }): Promise<void> {
    const template = this.templateService.getLoginOtpEmailTemplate("en");
    const html = this.templateService.injectData(template, {
      otpCode: otpValue,
    });
    const email = {
      from: this.configService.get<string>("emailFrom"),
      to: userEmailAddress,
      subject: this.configService.get<string>("emailSubjects.loginOtp"),
      content: html,
    } as Email;
    await this.emailService.sendEmailAsync(email);
  }
}
