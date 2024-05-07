import { Module } from "@nestjs/common";
import { SignUpController } from "./sign-up.controller";
import { SignUpProfile } from "./mapping-profiles/sign-up.profile";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TokenModule, UserModule],
  controllers: [SignUpController],
  providers: [SignUpProfile],
})
export class SignUpModule {}
