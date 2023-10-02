import { Inject, Controller, Post, Body } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { TokenService } from "../token/token.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthResponseDto } from "./dto/response.dto";
import { InjectMapper } from "@automapper/nestjs";
import { User } from "../entities/user.entity";
import { Mapper } from "@automapper/core";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class AuthController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("login")
  async loginAsync(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.validateUserPasswordAsync(
      loginDto.username || loginDto.email,
      loginDto.password
    );
    const token = await this.tokenService.createTokenAsync(user);
    return { id_token: token };
  }

  @Post("sign-up")
  async signUpAsync(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
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
