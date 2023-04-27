import { AuthController } from "./auth.controller";
import { Module } from "@nestjs/common";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";
import { SignUpProfile } from "./mapping-profiles/sign-up.profile";
import { LoginProfile } from "./mapping-profiles/login.profile";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";

@Module({
  imports: [
    TokenModule,
    UserModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  controllers: [AuthController],
  providers: [SignUpProfile, LoginProfile],
})
export class AuthModule {}
