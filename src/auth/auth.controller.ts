import {
  Inject,
  Controller,
  Post,
  Body,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import { ApiTags } from "@nestjs/swagger";
import { TokenService } from "../token/token.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthResponseDto } from "./dto/response.dto";

@ApiTags("authentication")
@Controller()
export class AuthController {
  constructor(
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.validateUser(loginDto);
    const token = await this.tokenService.createToken(user, 3600);
    return { id_token: token };
  }

  @Post("signup")
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const user = await this.userService.createUser(signUpDto);
    const token = await this.tokenService.createToken(user, 3600);
    return { id_token: token };
  }
}
