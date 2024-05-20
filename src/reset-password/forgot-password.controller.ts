import {
  Inject,
  Controller,
  Post,
  Body,
  BadRequestException,
} from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ResetPasswordService } from "./reset-password.service";
import { OkResponse } from "../dto";
import { UserService } from "../user/user.service";
import { InvalidResetPasswordRequestError } from "../error";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordCreatedEvent } from "../notification/dto";
import { CreateResetPasswordRequest } from "./dto/create-reset-password-request.dto";
import { ActiveResetPasswordRequestExistsError } from "../error/active-reset-password-request-exists.error";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class ForgotPasswordController {
  constructor(
    @Inject("UserService") private readonly userService: UserService,
    @Inject("ResetPasswordService")
    private readonly resetPasswordService: ResetPasswordService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService
  ) {}

  @Post("forgot-password")
  async forgotPasswordAsync(
    @Body() createResetPasswordRequest: CreateResetPasswordRequest
  ): Promise<OkResponse> {
    try {
      const user = await this.userService.getUserAsync({
        email: createResetPasswordRequest.email,
      });

      if (!user) throw new InvalidResetPasswordRequestError();

      const userResetPasswordRequest =
        await this.resetPasswordService.createResetPasswordRequest(user.email);

      const resetPasswordCreatedEvent: ResetPasswordCreatedEvent = {
        emailAddress: user.email,
        resetLink:
          this.configService.get("resetPassword.url") +
          userResetPasswordRequest.key,
      };

      this.eventEmitter.emit(
        "reset-password.email.created",
        resetPasswordCreatedEvent
      );

      return new OkResponse();
    } catch (error) {
      if (
        error instanceof InvalidResetPasswordRequestError ||
        error instanceof ActiveResetPasswordRequestExistsError
      )
        throw new BadRequestException(null, { cause: error });
    }
  }
}
