import { Controller, Post } from "@nestjs/common";

import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post("login")
  async login(loginDto: LoginDto) {
    return this.userService.validateUser(loginDto.username, loginDto.password);
  }

  @Post("signup")
  async signUp() {}
}
