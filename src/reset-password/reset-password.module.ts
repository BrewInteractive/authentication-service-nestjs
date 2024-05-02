import { EmailModule } from "../email/email.module";
import { Module } from "@nestjs/common";
import { ResetPasswordController } from "./reset-password.controller";
import { TemplateModule } from "../template/template.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule, EmailModule, TemplateModule],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
