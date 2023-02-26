import { Inject, Injectable } from "@nestjs/common";

import { BasePlugin } from "../../../abstract/base-plugin.plugin";
import { ModuleRef } from "@nestjs/core";
import { PluginTestService } from "../../../../plugin-test/plugin-test.service";
import { brewAuthenticationApi } from "../package.json";

@Injectable()
export class Text2AppenderPlugin extends BasePlugin {
  @Inject("PluginTestService")
  private pluginTestService: PluginTestService;
  constructor() {
    super(brewAuthenticationApi);
  }
  async load(moduleRef: ModuleRef): Promise<void> {
    this.pluginTestService.appendText("Text2");
    return Promise.resolve();
  }
}
