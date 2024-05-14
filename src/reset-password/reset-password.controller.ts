import { Inject, Controller, Post, Body, UseFilters } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ResetPasswordRequest } from "./dto/reset-password-request.dto";
import { ResetPasswordService } from "./reset-password.service";
import { ExceptionsFilter } from "../filter/exceptions.filter";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class ResetPasswordController {
  constructor(
    @Inject("ResetPasswordService")
    private readonly resetPasswordService: ResetPasswordService
  ) {}

  @Post("reset-password")
  @UseFilters(new ExceptionsFilter())
  async resetPasswordAsync(
    @Body() resetPasswordRequest: ResetPasswordRequest
  ): Promise<string> {
    await this.resetPasswordService.resetPasswordAsync(resetPasswordRequest);
    return "OK";
  }
}
