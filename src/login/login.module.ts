import { LoginController } from "./login.controller";
import { LoginProfile } from "./mapping-profiles/login.profile";
import { Module } from "@nestjs/common";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";
import { SendLoginOtpEmailController } from "./send-otp-email-login.controller";

@Module({
  imports: [TokenModule, UserModule],
  controllers: [LoginController, SendLoginOtpEmailController],
  providers: [LoginProfile],
})
export class LoginModule {}
