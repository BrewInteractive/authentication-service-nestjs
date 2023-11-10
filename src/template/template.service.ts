import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { Content } from './dto/content.dto'
import * as Handlebars from 'handlebars';
import mjml2html = require('mjml');

@Injectable()
export class TemplateService{

  getResetPasswordEmail<T>(data: T): string {
    const template = this.getResetPasswordEmailTemplate("en");
    return this._injectData(template, data);
  }

  public getResetPasswordEmailTemplate(locale: string): Content {
    var content = new Content();
    content.mjml = readFileSync(`${__dirname}/templates/${locale}/reset-password.mjml`, 'utf8');
    return content;
  }

  private _injectData<T>(content: Content, data: T): string {
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