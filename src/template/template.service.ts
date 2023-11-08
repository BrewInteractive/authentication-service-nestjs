import { Injectable } from '@nestjs/common';
import { ResetPasswordEmailData } from './dto/reset-password-email-data.dto';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import mjml2html = require('mjml');

@Injectable()
export class TemplateService{
  private readonly templatesFolderPath = './src/template/templates/';

  getResetPasswordEmail(data: ResetPasswordEmailData): string {
    const template = this._getResetPasswordEmailTemplate();
    return this._compileAndInjectData(template, data);
  }

  protected _getResetPasswordEmailTemplate(): string {
    return readFileSync(`${this.templatesFolderPath}reset-password.mjml`, 'utf8');
  }

  protected _compileAndInjectData(mjmlTemplate: string, data: ResetPasswordEmailData): string {
    const htmlTemplate = mjml2html(mjmlTemplate, { validationLevel: 'strict' });
    const templateFn = Handlebars.compile(htmlTemplate.html);
    return templateFn(data);
  }
}