import { LoginController } from "./login.controller";
import { LoginOtpEmailController } from "./login-otp-email.controller";
import { LoginProfile } from "./mapping-profiles/login.mapping-profile";
import { Module } from "@nestjs/common";
import { OtpModule } from "../otp/otp.module";
import { SendLoginOtpEmailController } from "./send-login-otp-email.controller";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TokenModule, UserModule, OtpModule],
  controllers: [
    LoginController,
    LoginOtpEmailController,
    SendLoginOtpEmailController,
  ],
  providers: [LoginProfile],
})
export class LoginModule {}
