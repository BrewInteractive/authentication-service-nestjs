import { IsNotEmpty, ValidateIf } from "class-validator";

export class TemplateContent {
  @ValidateIf((o) => !o.mjml)
  @IsNotEmpty()
  html: string;
  @ValidateIf((o) => !o.html)
  @IsNotEmpty()
  mjml: string;
}