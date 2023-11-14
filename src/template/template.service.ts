import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import { TemplateContent } from "./dto/template-content.dto";
import * as Handlebars from "handlebars";
import mjml2html from "mjml";

@Injectable()
export class TemplateService {
  public getResetPasswordEmailTemplate(locale: string): TemplateContent {
    let content = new TemplateContent();
    const MJML_TEMPLATE_PATH = `${__dirname}/templates/${locale}/reset-password.mjml`;
    content.mjml = readFileSync(MJML_TEMPLATE_PATH, "utf8");
    return content;
  }
  public injectData<T>(content: TemplateContent, data: T): string {
    if (content.html) {
      const templateFn = Handlebars.compile(content.html);
      return templateFn(data);
    } else if (content.mjml) {
      const htmlTemplate = mjml2html(content.mjml, {
        validationLevel: "strict",
      });
      const templateFn = Handlebars.compile(htmlTemplate.html);
      return templateFn(data);
    }
  }
}
