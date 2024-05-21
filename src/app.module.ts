import { Module, forwardRef } from "@nestjs/common";
import {
  appConfig,
  authenticationConfig,
  emailConfig,
  serverConfig,
} from "./config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { LoginModule } from "./login/login.module";
import { NotificationModule } from "./notification/notification.module";
import { PluginModule } from "@brewww/nestjs-plugin-module";
import { RefreshTokenModule } from "./refresh-token/refresh-token.module";
import { ResetPasswordModule } from "./reset-password/reset-password.module";
import { SignUpModule } from "./sign-up/sign-up.module";
import { TokenModule } from "./token/token.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { classes } from "@automapper/classes";
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
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    SignUpModule,
    LoginModule,
    ResetPasswordModule,
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authenticationConfig, emailConfig, serverConfig],
    }),
    RefreshTokenModule,
    NotificationModule,
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
