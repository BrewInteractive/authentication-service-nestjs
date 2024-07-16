import { Module } from "@nestjs/common";
import { SignUpController } from "./sign-up.controller";
import { SignUpProfile } from "./mapping-profiles/sign-up.mapping-profile";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";
import { OtpModule } from "../otp/otp.module";
import { SendSignUpOtpPhoneController } from "./send-sign-up-otp-phone.controller";

@Module({
  imports: [TokenModule, UserModule, OtpModule],
  controllers: [SignUpController, SendSignUpOtpPhoneController],
  providers: [SignUpProfile],
})
export class SignUpModule {}
