import { User, UserResetPasswordRequest } from "../entities";

import { EmailModule } from "../email/email.module";
import { Module } from "@nestjs/common";
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordService } from "./reset-password.service";
import { TemplateModule } from "../template/template.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    EmailModule,
    TemplateModule,
    TypeOrmModule.forFeature([User, UserResetPasswordRequest]),
  ],
  controllers: [ResetPasswordController],
  providers: [
    { provide: "ResetPasswordService", useClass: ResetPasswordService },
  ],
})
export class ResetPasswordModule {}
