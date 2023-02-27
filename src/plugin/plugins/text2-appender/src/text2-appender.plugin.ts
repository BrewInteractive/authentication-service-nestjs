import { Inject, Injectable } from "@nestjs/common";

import { BasePlugin } from "../../../abstract/base-plugin.plugin";
import { PluginTestService } from "../../../../plugin-test/plugin-test.service";
import { authenticationService } from "../package.json";

@Injectable()
export class Text2AppenderPlugin extends BasePlugin {
  @Inject("PluginTestService")
  private pluginTestService: PluginTestService;
  constructor() {
    super(authenticationService);
  }
  async load(): Promise<void> {
    this.pluginTestService.appendText("Text2");
    return Promise.resolve();
  }
}
