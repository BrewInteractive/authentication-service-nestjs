import * as Handlebars from "handlebars";

import { existsSync, readFileSync } from "fs";

import { Injectable } from "@nestjs/common";

@Injectable()
export class TemplateService {
  private readonly DEFAULT_LOCALE = "en";

  public getLoginOtpEmailTemplate(locale: string): string {
    return this.getTemplate("login-otp.html", locale, "html");
  }

  public getLoginOtpSmsTemplate(locale: string): string {
    return this.getTemplate("login-otp-sms.txt", locale, "text");
  }

  public getResetPasswordEmailTemplate(locale: string): string {
    return this.getTemplate("reset-password.html", locale, "html");
  }

  public getSignupOtpEmailTemplate(locale: string): string {
    return this.getTemplate("sign-up-otp.html", locale, "html");
  }

  public getSignUpOtpSmsTemplate(locale: string): string {
    return this.getTemplate("sign-up-otp-sms.txt", locale, "text");
  }

  public injectData<T>(htmlTemplate: string, data: T): string {
    const templateFn = Handlebars.compile(htmlTemplate);
    return templateFn(data);
  }

  private getTemplate(
    file: string,
    locale: string,
    type: "html" | "text"
  ): string {
    const path = `${__dirname}/templates/${type}/${locale}/${file}`;
    if (existsSync(path)) return readFileSync(path, "utf8");
    else
      return readFileSync(
        `${__dirname}/templates/${type}/${this.DEFAULT_LOCALE}/${file}`,
        "utf8"
      );
  }
}
