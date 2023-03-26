import {
  Inject,
  Controller,
  Post,
  Body,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import { ApiTags } from "@nestjs/swagger";
import { TokenService } from "../token/token.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthResponseDto } from "./dto/response.dto";
import * as bcrypt from "bcrypt";

@ApiTags("authentication")
@Controller()
export class AuthController {
  constructor(
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserService") private readonly userService: UserService
  ) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.getUser(
      loginDto.username,
      loginDto.email
    );
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }
    this.tokenService.addCustomClaims("user_id", user.id);
    this.tokenService.addCustomClaims("email", user.email);
    this.tokenService.addCustomClaims("username", user.username);
    const token = await this.tokenService.createToken(3600);
    return { id_token: token };
  }

  @Post("signup")
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const user = await this.userService.createUser(signUpDto);
    this.tokenService.addCustomClaims("user_id", user.id);
    this.tokenService.addCustomClaims("email", user.email);
    this.tokenService.addCustomClaims("username", user.username);
    const token = await this.tokenService.createToken(3600);
    return { id_token: token };
  }
}
