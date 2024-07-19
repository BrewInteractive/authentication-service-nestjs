import { Module } from "@nestjs/common";
import { SignUpController } from "./sign-up.controller";
import { SignUpProfile } from "./mapping-profiles/sign-up.mapping-profile";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";
import { SendSignUpOtpEmailController } from "./send-sign-up-otp-email.controller";
import { OtpModule } from "../otp/otp.module";
import { SendSignUpOtpPhoneController } from "./send-sign-up-otp-phone.controller";

@Module({
  imports: [TokenModule, UserModule, OtpModule],
  controllers: [SignUpController, SendSignUpOtpPhoneController, SendSignUpOtpEmailController],
  providers: [SignUpProfile],
})
export class SignUpModule {}
