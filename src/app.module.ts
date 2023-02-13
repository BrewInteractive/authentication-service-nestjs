import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Module } from "@nestjs/common";
import { PluginModule } from "./plugin/plugin.module";

@Module({
  imports: [PluginModule.registerAsync()],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
