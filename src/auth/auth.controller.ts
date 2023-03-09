import { Controller, Post } from "@nestjs/common";
import { UserCredentials } from "./auth.types";

@Controller()
export class AuthController {
  @Post("login")
  async login(userCredentials: UserCredentials) {}

  @Post("signup")
  async signUp() {}
}
