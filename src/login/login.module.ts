import { LoginController } from "./login.controller";
import { LoginOtpEmailController } from "./login-otp-email.controller";
import { LoginProfile } from "./mapping-profiles/login.profile";
import { Module } from "@nestjs/common";
import { OtpModule } from "../otp/otp.module";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";
import { SendLoginOtpEmailController } from "./send-otp-email-login.controller";

@Module({
  imports: [TokenModule, UserModule, OtpModule],
  controllers: [LoginController, LoginOtpEmailController, SendLoginOtpEmailController],
  providers: [LoginProfile],
})
export class LoginModule {}
