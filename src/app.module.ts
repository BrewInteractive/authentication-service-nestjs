import { Module, forwardRef } from "@nestjs/common";
import {
  applicationInfoConfigurations,
  authenticationConfigurations,
  emailConfigurations,
  serverConfigurations,
} from "./config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { LoginModule } from "./login/login.module";
import { PluginModule } from "@brewww/nestjs-plugin-module";
import { RefreshTokenModule } from "./refresh-token/refresh-token.module";
import { ResetPasswordModule } from "./reset-password/reset-password.module";
import { SignUpModule } from "./sign-up/sign-up.module";
import { TokenModule } from "./token/token.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { dataSourceOptions } from "../db/data-source";

@Module({
  imports: [
    PluginModule.registerAsync({
      imports: [
        forwardRef(() => AppModule),
        forwardRef(() => TokenModule),
        forwardRef(() => UserModule),
      ],
    }),
    SignUpModule,
    LoginModule,
    ResetPasswordModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        applicationInfoConfigurations,
        authenticationConfigurations,
        emailConfigurations,
        serverConfigurations,
      ],
    }),
    RefreshTokenModule,
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
