import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "../email/email.module";
import { Module } from "@nestjs/common";
import { ResetPasswordController } from "./reset-password.controller";
import { TemplateModule } from "../template/template.module";
import { UserModule } from "../user/user.module";
import { classes } from "@automapper/classes";

@Module({
  imports: [
    UserModule,
    EmailModule,
    TemplateModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),
  ],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
