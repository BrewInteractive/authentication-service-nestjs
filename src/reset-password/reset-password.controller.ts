import { Inject, Controller, Post, Body } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ResetPasswordRequest } from "./dto/reset-password-request.dto";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class ResetPasswordController {
  constructor(
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("reset-password")
  async resetPasswordAsync(
    @Body() resetPasswordRequest: ResetPasswordRequest
  ): Promise<string> {
    
    await this.userService.resetPasswordAsync(resetPasswordRequest);
    return "OK";
  }
}
