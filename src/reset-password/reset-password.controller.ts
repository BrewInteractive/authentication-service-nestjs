import {
  Inject,
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ResetPasswordRequest } from "./dto/reset-password-request.dto";
import { SendResetPasswordRequest } from "./dto/send-reset-password-request.dto";
import { TemplateService } from "../template/template.service";
import { EmailService } from "../email/email.service";
import { Email } from "../email/dto/email.dto";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordService } from "./reset-password.service";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class ResetPasswordController {
  constructor(
    @Inject("ResetPasswordService")
    private readonly resetPasswordService: ResetPasswordService,
    @Inject("TemplateService")
    private readonly templateService: TemplateService,
    @Inject("EmailService") private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {}

  @Post("reset-password")
  async resetPasswordAsync(
    @Body() resetPasswordRequest: ResetPasswordRequest
  ): Promise<string> {
    await this.resetPasswordService.resetPasswordAsync(resetPasswordRequest);
    return "OK";
  }

  @Post("send-reset-password-request")
  async sendResetPasswordRequestAsync(
    @Body() sendResetPasswordRequest: SendResetPasswordRequest,
    @Res() response
  ): Promise<string> {
    const request =
      await this.resetPasswordService.getResetPasswordRequestByIdAsync(
        sendResetPasswordRequest.requestId
      );
    if (request.resendableAt < new Date()) {
      response.status(HttpStatus.ACCEPTED).send("Debounced");
      return;
    }
    const template = this.templateService.getResetPasswordEmailTemplate("en");
    const html = this.templateService.injectData(template, {
      resetLink: this.configService.get<string>("RESET_LINK") + request.key,
    });
    const email = {
      from: this.configService.get<string>("EMAIL_FROM"),
      to: request.user.email,
      subject: "Reset password",
      content: html,
    } as Email;
    await this.emailService.sendEmailAsync(email);
    return "OK";
  }
}
