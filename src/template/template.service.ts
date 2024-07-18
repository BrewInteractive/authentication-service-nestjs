import * as Handlebars from "handlebars";

import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";

@Injectable()
export class TemplateService {
  public getLoginOtpEmailTemplate(locale: string): string {
    return readFileSync(
      `${__dirname}/templates/html/${locale}/login-otp.html`,
      "utf8"
    );
  }

  public getLoginOtpSmsTemplate(locale: string): string {
    return readFileSync(
      `${__dirname}/templates/text/${locale}/login-otp-sms.txt`,
      "utf8"
    );
  }

  public getResetPasswordEmailTemplate(locale: string): string {
    return readFileSync(
      `${__dirname}/templates/html/${locale}/reset-password.html`,
      "utf8"
    );
  }

  public injectData<T>(htmlTemplate: string, data: T): string {
    const templateFn = Handlebars.compile(htmlTemplate);
    return templateFn(data);
  }

   public getSignupOtpEmailTemplate(locale: string): string {
    return readFileSync(
      `${__dirname}/templates/html/${locale}/sign-up-otp.html`,
      "utf8"
    );
  }

    public getSignUpOtpSmsTemplate(locale: string): string {
    return readFileSync(
      `${__dirname}/templates/text/${locale}/sign-up-otp-sms.txt`,
      "utf8"
    );
  }
}
