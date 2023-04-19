import { Inject, Controller, Post, Body } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import { ApiTags } from "@nestjs/swagger";
import { TokenService } from "../token/token.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthResponseDto } from "./dto/response.dto";
import { InjectMapper } from "@automapper/nestjs";
import { User } from "../models/user.entity";
import { Mapper } from "@automapper/core";

@ApiTags("authentication")
@Controller()
export class AuthController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.mapper.mapAsync(loginDto, LoginDto, User);
    const responseUser = await this.userService.validateUserAsync(user);
    const id_token = await this.tokenService.createToken(responseUser, 3600);
    return { id_token };
  }

  @Post("signup")
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const user = await this.mapper.mapAsync(signUpDto, SignUpDto, User);
    const responseUser = await this.userService.createUserAsync(user);
    const id_token = await this.tokenService.createToken(responseUser, 3600);
    return { id_token };
  }
}
