import { Controller, Get, Inject } from "@nestjs/common";

import { PluginTestService } from "./plugin-test.service";

@Controller("plugin-test")
export class PluginTestController {
  constructor(
    @Inject("PluginTestService")
    private readonly pluginTestService: PluginTestService
  ) {}
  @Get()
  getHello(): string {
    return this.pluginTestService.getHello();
  }
}
