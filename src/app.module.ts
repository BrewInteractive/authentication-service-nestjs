import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Module } from "@nestjs/common";
import { PluginModule } from "./plugin/plugin.module";
import { PluginTestModule } from "./plugin-test/plugin-test.module";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "../db/data-source";
import config from "./utils/config";
import { ConfigModule } from "@nestjs/config";
import { TokenModule } from "./token/token.module";

@Module({
  imports: [
    PluginTestModule,
    TokenModule,
    // AuthModule,
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
