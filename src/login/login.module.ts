import { AutomapperModule } from "@automapper/nestjs";
import { LoginController } from "./login.controller";
import { LoginOtpEmailController } from "./login-otp-email.controller";
import { LoginProfile } from "./mapping-profiles/login.profile";
import { Module } from "@nestjs/common";
import { OtpModule } from "src/otp/otp.module";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";
import { classes } from "@automapper/classes";

@Module({
  imports: [
    TokenModule,
    UserModule,
    OtpModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  controllers: [LoginController, LoginOtpEmailController],
  providers: [LoginProfile],
})
export class LoginModule {}
