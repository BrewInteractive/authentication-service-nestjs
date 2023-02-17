import { Inject, Injectable } from "@nestjs/common";

import { Plugin } from "../../interfaces/plugin.interface";
import { PluginTestService } from "../../../plugin-test/plugin-test.service";
import { brewAuthenticationApi } from "./package.json";

@Injectable()
export class HelloWorldOverriderPlugin implements Plugin {
  @Inject(PluginTestService)
  private readonly pluginTestService: PluginTestService;
  constructor() {
    this.name = brewAuthenticationApi.name;
    this.displayName = brewAuthenticationApi.displayName;
  }

  name: string;
  displayName: string;

  load(): Promise<void> {
    this.pluginTestService.getHelloWorld = function () {
      return "Hello World overriden!";
    };
    this.pluginTestService.appendText("Text1");
    return Promise.resolve();
  }
}
