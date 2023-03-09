import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TokenModule } from "../token/token.module";
import { UserService } from "src/user/user.service";

@Module({
  imports: [TokenModule],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
