import { Module, forwardRef } from "@nestjs/common";

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
import config from "./config/configuration";
import { dataSourceOptions } from "../db/data-source";

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
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
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    RefreshTokenModule,
    NotificationModule,
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
