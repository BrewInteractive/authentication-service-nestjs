import { Inject, Injectable } from "@nestjs/common";

import { Plugin } from "../../interfaces/plugin.interface";
import { PluginTestService } from "../../../plugin-test/plugin-test.service";

@Injectable()
export class HelloWorldOverriderPlugin implements Plugin {
  @Inject(PluginTestService)
  private readonly pluginTestService: PluginTestService;
  load(): Promise<void> {
    this.pluginTestService.getHelloWorld = function () {
      return "Hello World overriden!";
    };
    this.pluginTestService.appendText("Text1");
    return Promise.resolve();
  }
}
