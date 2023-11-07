import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Module } from "@nestjs/common";
import { PluginModule } from "./plugin/plugin.module";
import { PluginTestModule } from "./plugin-test/plugin-test.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "../db/data-source";
import config from "./utils/config";
import { ConfigModule } from "@nestjs/config";
import { SignUpModule } from "./sign-up/sign-up.module";
import { LoginModule } from "./login/login.module";
import { ResetPasswordModule } from "./reset-password/reset-password.module";
import { TemplateModule } from "./template/template.module";

@Module({
  imports: [
    PluginTestModule,
    SignUpModule,
    LoginModule,
    ResetPasswordModule,
    PluginModule.registerAsync(),
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
