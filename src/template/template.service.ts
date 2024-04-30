import * as Handlebars from "handlebars";

import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";

@Injectable()
export class TemplateService {
  public getResetPasswordEmailTemplate(locale: string): string {
    return readFileSync(
      `${__dirname}/dist-templates/${locale}/reset-password.mjml`,
      "utf8"
    );
  }

  public getOtpEmailTemplate(locale: string): string {
    return readFileSync(
      `${__dirname}/dist-templates/${locale}/otp.mjml`,
      "utf8"
    );
  }

  public injectData<T>(htmlTemplate: string, data: T): string {
    const templateFn = Handlebars.compile(htmlTemplate);
    return templateFn(data);
  }
}
