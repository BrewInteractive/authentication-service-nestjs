import {
  Inject,
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ResetPasswordRequest } from "./dto/reset-password-request.dto";
import { Response } from "express";
import { TemplateService } from "../template/template.service";
import { EmailService } from "../email/email.service";
import { Email } from "../email/dto/email.dto";
import { ConfigService } from "@nestjs/config";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class ResetPasswordController {
  constructor(
    @Inject("UserService") private readonly userService: UserService,
    @Inject("TemplateService")
    private readonly templateService: TemplateService,
    @Inject("EmailService") private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {}

  @Post("reset-password")
  async resetPasswordAsync(
    @Body() resetPasswordRequest: ResetPasswordRequest
  ): Promise<string> {
    await this.userService.resetPasswordAsync(resetPasswordRequest);
    return "OK";
  }
}
