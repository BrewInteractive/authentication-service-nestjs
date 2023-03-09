import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [TokenModule],
  controllers: [AuthController],
})
export class AuthModule {}
