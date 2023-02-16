import { Module } from "@nestjs/common";
import { PluginTestController } from "./plugin-test.controller";
import { PluginTestService } from "./plugin-test.service";

@Module({
  controllers: [PluginTestController],
  providers: [PluginTestService],
  exports: [PluginTestService],
})
export class PluginTestModule {}
