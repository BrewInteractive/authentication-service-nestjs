import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import mjml2html = require('mjml');

@Injectable()
export class TemplateService{

    private readonly templatesFolderPath = './src/template/templates/';

  getResetPasswordEmail(data: any): string {
    const cwd = process.cwd();
    const templateFile = this.getResetPasswordEmailTemplate();
    const templateContent = readFileSync(templateFile, 'utf8');
    const emailContent = this.compileAndInjectData(templateContent, data);
    return emailContent;
  }

  private getResetPasswordEmailTemplate(): string {
    return `${this.templatesFolderPath}reset-password.mjml`;
  }

  private compileAndInjectData(mjmlTemplate: string, data: any): string {
    const htmlTemplate = mjml2html(mjmlTemplate, { validationLevel: 'strict' });
    const templateFn = Handlebars.compile(htmlTemplate.html);
    return templateFn(data);
  }
}