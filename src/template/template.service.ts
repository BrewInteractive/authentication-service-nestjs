import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import * as Handlebars from "handlebars";
import mjml2html = require("mjml");

@Injectable()
export class TemplateService {

  public getResetPasswordEmailTemplate(locale: string): string {
    const MJML_TEMPLATE_PATH = `${__dirname}/templates/${locale}/reset-password.mjml`;
    const mjmlTemplate = readFileSync(MJML_TEMPLATE_PATH, "utf8");
    return mjml2html(mjmlTemplate, {
      validationLevel: "strict",
    }).html;
  }
  
  public injectData<T>(htmlTemplate: string, data: T): string {
    const templateFn = Handlebars.compile(htmlTemplate);
    return templateFn(data);
  }
}