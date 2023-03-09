import { Controller, Post } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { UserCredentials } from "./auth.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post("login")
  async login(userCredentials: UserCredentials) {
    return this.userService.validateUser(
      userCredentials.username,
      userCredentials.password
    );
  }

  @Post("signup")
  async signUp() {}
}
