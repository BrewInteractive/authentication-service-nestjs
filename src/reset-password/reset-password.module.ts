import { ResetPasswordController } from "./reset-password.controller";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    UserModule,
  ],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
