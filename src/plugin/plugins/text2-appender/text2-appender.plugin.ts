import { Inject, Injectable } from "@nestjs/common";

import { Plugin } from "../../interfaces/plugin.interface";
import { PluginTestService } from "../../../plugin-test/plugin-test.service";
import { brewAuthenticationApi } from "./package.json";

@Injectable()
export class Text2AppenderPlugin implements Plugin {
  @Inject(PluginTestService)
  private readonly pluginTestService: PluginTestService;

  constructor() {
    this.name = brewAuthenticationApi.name;
    this.displayName = brewAuthenticationApi.displayName;
  }
  name: string;
  displayName: string;

  load(): Promise<void> {
    this.pluginTestService.appendText("Text2");
    return Promise.resolve();
  }
}
