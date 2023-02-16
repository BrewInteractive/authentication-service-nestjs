import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Module } from "@nestjs/common";
import { PluginModule } from "./plugin/plugin.module";
import { PluginTestModule } from "./plugin-test/plugin-test.module";

@Module({
  imports: [PluginModule.registerAsync(), PluginTestModule],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
