import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./auth.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(loginDto: LoginDto) {
    return this.authService.validateUser(loginDto.userName, loginDto.password);
  }

  @Post("signup")
  async signUp() {}
}
