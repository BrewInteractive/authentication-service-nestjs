import { Inject, Controller, Post, Body } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { TokenService } from "../token/token.service";
import { LoginResponseDto } from "./dto/login-response.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

@ApiTags("authentication")
@Controller()
@ApiSecurity("ApiKey")
export class LoginController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("login")
  async loginAsync(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.validateUserAsync(
      loginDto.username || loginDto.email,
      loginDto.password
    );
    const token = await this.tokenService.createTokenAsync(user);
    return { id_token: token };
  }
}
