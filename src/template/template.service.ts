import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { Content } from './dto/content.dto'
import * as Handlebars from 'handlebars';
import mjml2html = require('mjml');

@Injectable()
export class TemplateService{

  getResetPasswordEmail<T>(data: T): string {
    const template = this.getResetPasswordEmailTemplate("en");
    return this.injectData(template, data);
  }

  public getResetPasswordEmailTemplate(locale: string): Content {
    let content = new Content();
    const MJML_TEMPLATE_PATH = `${__dirname}/templates/${locale}/user-invite.mjml`;
    content.mjml = readFileSync(MJML_TEMPLATE_PATH, 'utf8');
    return content;
  }

  private injectData<T>(content: Content, data: T): string {
    if (content.html) {
      const templateFn = Handlebars.compile(content.html);
      return templateFn(data);
    } else if(content.mjml) {
      const htmlTemplate = mjml2html(content.mjml, { validationLevel: 'strict' });
      const templateFn = Handlebars.compile(htmlTemplate.html);
      return templateFn(data);
    }
  }
}