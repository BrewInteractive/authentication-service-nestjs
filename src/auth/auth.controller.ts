import { Controller, Post } from "@nestjs/common";

import { LoginDto } from "./dto/login.dto";

@Controller()
export class AuthController {
  @Post("login")
  async login(loginDto: LoginDto) {}

  @Post("signup")
  async signUp() {}
}
