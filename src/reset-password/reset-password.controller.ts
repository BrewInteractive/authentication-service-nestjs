import {
  Inject,
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ResetPasswordRequest } from "./dto/reset-password-request.dto";
import { ResetPasswordService } from "./reset-password.service";
import { OkResponse } from "../dto";
import { UserService } from "../user/user.service";
import { InvalidResetPasswordRequestError } from "../error";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class ResetPasswordController {
  constructor(
    @Inject("UserService") private readonly userService: UserService,
    @Inject("ResetPasswordService")
    private readonly resetPasswordService: ResetPasswordService
  ) {}

  @Post("reset-password")
  async resetPasswordAsync(
    @Body() resetPasswordRequest: ResetPasswordRequest
  ): Promise<OkResponse> {
    try {
      const user = await this.userService.getUserAsync({
        email: resetPasswordRequest.email,
      });

      if (!user) throw new InvalidResetPasswordRequestError();

      await this.resetPasswordService.resetPasswordAsync(
        user,
        resetPasswordRequest.newPassword,
        resetPasswordRequest.key
      );
      return new OkResponse();
    } catch (error) {
      if (error instanceof InvalidResetPasswordRequestError)
        throw new BadRequestException(null, { cause: error });

      throw new InternalServerErrorException();
    }
  }
}
