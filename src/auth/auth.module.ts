import { AuthController } from "./auth.controller";
import { Module } from "@nestjs/common";
import { TokenModule } from "../token/token.module";
import { UserService } from "../user/user.service";

@Module({
  imports: [TokenModule],
  providers: [{ provide: "UserService", useClass: UserService }],
  controllers: [AuthController],
})
export class AuthModule {}
