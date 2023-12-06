import { Inject, Controller, Post, Body } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { TokenService } from "../token/token.service";
import { SignUpRequest } from "./dto/sign-up-request.dto";
import { SignUpResponse } from "./dto/sign-up-response.dto";
import { InjectMapper } from "@automapper/nestjs";
import { User } from "../entities/user.entity";
import { Mapper } from "@automapper/core";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class SignUpController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("sign-up")
  async signUpAsync(
    @Body() signUpRequest: SignUpRequest
  ): Promise<SignUpResponse> {
    const userCandidate = await this.mapper.mapAsync(
      signUpRequest,
      SignUpRequest,
      User
    );
    const user = await this.userService.createUserAsync(
      userCandidate,
      signUpRequest.appData
    );
    const tokens = await this.tokenService.createTokensAsync(user);
    return tokens;
  }
}
