import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [TokenModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
