import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Module } from "@nestjs/common";
import { PluginModule } from "./plugin/plugin.module";
import { PluginTestModule } from "./plugin-test/plugin-test.module";
import { TokenModule } from "./token/token.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    PluginTestModule,
    PluginModule.registerAsync(),
    TokenModule,
    AuthModule,
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
