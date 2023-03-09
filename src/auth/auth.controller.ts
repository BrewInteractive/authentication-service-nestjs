import { Controller, Post } from "@nestjs/common";
import { UserCredentials } from "./auth.types";

@Controller("auth")
export class AuthController {
  @Post("login")
  async login(userCredentials: UserCredentials) {}

  @Post("signup")
  async signUp() {}
}
