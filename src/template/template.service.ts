import * as Handlebars from "handlebars";

import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";

@Injectable()
export class TemplateService {
  public getResetPasswordEmailTemplate(locale: string): string {
    return readFileSync(
      `${__dirname}/templates/html/${locale}/reset-password.html`,
      "utf8"
    );
  }

  public getLoginOtpEmailTemplate(locale: string): string {
    return readFileSync(
      `${__dirname}/templates/html/${locale}/login-otp.html`,
      "utf8"
    );
  }

  public injectData<T>(htmlTemplate: string, data: T): string {
    const templateFn = Handlebars.compile(htmlTemplate);
    return templateFn(data);
  }
}
