import { ResetPasswordController } from "./reset-password.controller";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { EmailModule } from "../email/email.module";
import { TemplateModule } from "../template/template.module";
import { ConfigModule } from "@nestjs/config";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes/src/lib/classes";

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
