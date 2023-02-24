import { Module } from "@nestjs/common";
import { PluginTestController } from "./plugin-test.controller";
import { PluginTestService } from "./plugin-test.service";
// import { PluginTestController } from "brew-authentication-api/dist/plugin-test/plugin-test.controller";
// import { PluginTestService } from "brew-authentication-api/dist/plugin-test/plugin-test.service";

@Module({
  controllers: [PluginTestController],
  providers: [PluginTestService],
  exports: [PluginTestService],
})
export class PluginTestModule {}
