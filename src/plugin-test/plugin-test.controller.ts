import { Controller, Get } from "@nestjs/common";

import { PluginTestService } from "./plugin-test.service";

// import { PluginTestService } from "brew-authentication-api/dist/plugin-test/plugin-test.service";

@Controller("plugin-test")
export class PluginTestController {
  constructor(private readonly pluginTestService: PluginTestService) {}
  @Get()
  getHello(): string {
    return this.pluginTestService.getHello();
  }
}
