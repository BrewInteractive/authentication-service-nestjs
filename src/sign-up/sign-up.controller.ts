import { Inject, Controller, Post, Body } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { TokenService } from "../token/token.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignUpResponseDto } from "./dto/response.dto";
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
  async signUpAsync(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    const userCandidate = await this.mapper.mapAsync(
      signUpDto,
      SignUpDto,
      User
    );
    const user = await this.userService.createUserAsync(
      userCandidate,
      signUpDto.appData
    );
    const id_token = await this.tokenService.createTokenAsync(user);
    return { id_token };
  }
}
