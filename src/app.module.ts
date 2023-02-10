import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Module } from "@nestjs/common";
import { PluginModule } from "./plugin/plugin.module";

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [PluginModule.registerAsync()],
})
export class AppModule {}
