import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TokenModule } from "../token/token.module";
import { UserService } from "src/user/user.service";

@Module({
  imports: [TokenModule],
  providers: [{ provide: "UserService", useClass: UserService }],
  controllers: [AuthController],
})
export class AuthModule {}
