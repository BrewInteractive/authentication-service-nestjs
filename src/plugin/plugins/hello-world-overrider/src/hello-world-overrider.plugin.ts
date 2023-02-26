import { Inject, Injectable } from "@nestjs/common";

import { BasePlugin } from "../../../abstract/base-plugin.plugin";
import { ModuleRef } from "@nestjs/core";
import { PluginTestService } from "../../../../plugin-test/plugin-test.service";
// import { PluginTestService } from "brew-authentication-api/dist/plugin-test/plugin-test.service";
import { brewAuthenticationApi } from "../package.json";

@Injectable()
export class HelloWorldOverriderPlugin extends BasePlugin {
  // @Inject(PluginTestService)
  // private pluginTestService: PluginTestService;
  constructor() {
    super(brewAuthenticationApi);
  }

  async load(moduleRef: ModuleRef): Promise<void> {
    const pluginTestService = moduleRef.get("PluginTestService", {
      strict: false,
    });
    pluginTestService.getHelloWorld = function () {
      return "Hello World overriden!";
    };
    pluginTestService.appendText("Text1");
    return Promise.resolve();
  }
}
