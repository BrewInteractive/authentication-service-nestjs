import { Inject, Injectable } from "@nestjs/common";
import { TemplateService } from "../template/template.service";
import { OnEvent } from "@nestjs/event-emitter";
import { ConfigService } from "@nestjs/config";
import { AuthenticationAction } from "../enum";
import { OtpEmailTemplateNotFoundError } from "./error";
import {
  ResetPasswordCreatedEvent,
  OtpEmailCreatedEvent,
  OtpSmsCreatedEvent,
} from "./dto";
import { OtpSmsTemplateNotFoundError } from "./error/otp-sms-template-not-found.error.ts";
import { NotificationService } from "@brewww/nestjs-notification-module/";

@Injectable()
export class AuthNotificationService {
  private readonly defaultLocale: string;
  constructor(
    @Inject("TemplateService")
    private readonly templateService: TemplateService,
    @Inject("NotificationService")
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService
  ) {
    this.defaultLocale = this.configService.get<string>(
      "notificationDefaultLocale"
    );
  }

  @OnEvent("otp.email.created")
  async onOtpEmailCreatedAsync(
    otpEmailCreatedEvent: OtpEmailCreatedEvent
  ): Promise<void> {
    const email = this.getOtpEmailByAuthAction(
      otpEmailCreatedEvent.otpValue,
      otpEmailCreatedEvent.authenticationAction,
      otpEmailCreatedEvent?.locale ?? this.defaultLocale,
      otpEmailCreatedEvent?.appData
    );

    if (email) {
      return await this.sendEmailAsync(
        email.subject,
        otpEmailCreatedEvent.emailAddress,
        email.content
      );
    }
  }

  @OnEvent("otp.sms.created")
  async onOtpSmsCreatedAsync(
    otpSmsCreatedEvent: OtpSmsCreatedEvent
  ): Promise<void> {
    const sms = this.getOtpSmsByAuthAction(
      otpSmsCreatedEvent.otpValue,
      otpSmsCreatedEvent.authenticationAction,
      otpSmsCreatedEvent?.locale ?? this.defaultLocale,
      otpSmsCreatedEvent?.appData
    );

    if (sms) {
      this.notificationService.sendSms({
        message: sms.message,
        phoneNumber: otpSmsCreatedEvent.phoneNumber,
      });
    }
  }

  @OnEvent("reset-password.email.created")
  async onResetPasswordEmailCreatedAsync(
    resetPasswordCreatedEvent: ResetPasswordCreatedEvent
  ): Promise<void> {
    const resetPasswordEmailTemplate =
      this.templateService.getResetPasswordEmailTemplate(
        resetPasswordCreatedEvent?.locale ?? this.defaultLocale
      );

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
    authenticationAction: AuthenticationAction,
    locale: string,
    appData?: object
  ): { subject: string; content: string } {
    let template = null;
    if (authenticationAction === AuthenticationAction.LOGIN)
      template = this.templateService.getLoginOtpEmailTemplate(locale);
    if (authenticationAction === AuthenticationAction.SIGNUP)
      template = this.templateService.getSignupOtpEmailTemplate(locale);

    if (template == null)
      throw new OtpEmailTemplateNotFoundError(authenticationAction);

    return {
      content: this.templateService.injectData(template, {
        otpValue,
        appData,
      }),
      subject: this.configService.get<string>("emailSubjects.loginOtp"),
    };
  }

  private getOtpSmsByAuthAction(
    otpValue: string,
    authenticationAction: AuthenticationAction,
    locale: string,
    appData?: object
  ): { message: string } {
    let template: string = null;
    if (authenticationAction === AuthenticationAction.LOGIN)
      template = this.templateService.getLoginOtpSmsTemplate(locale);
    if (authenticationAction === AuthenticationAction.SIGNUP)
      template = this.templateService.getSignUpOtpSmsTemplate(locale);
    if (template == null)
      throw new OtpSmsTemplateNotFoundError(authenticationAction);

    return {
      message: this.templateService.injectData(template, {
        otpValue,
        appData,
      }),
    };
  }

  private async sendEmailAsync(
    subject: string,
    to: string,
    content: string
  ): Promise<void> {
    return await this.notificationService.sendEmail({
      from: this.configService.get<string>("emailFrom"),
      to,
      subject,
      content,
    });
  }
}
