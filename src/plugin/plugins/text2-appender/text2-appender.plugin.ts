import { Inject, Injectable } from "@nestjs/common";

import { Plugin } from "../../interfaces/plugin.interface";
import { PluginTestService } from "../../../plugin-test/plugin-test.service";

@Injectable()
export class Text2AppenderPlugin implements Plugin {
  @Inject(PluginTestService)
  private readonly pluginTestService: PluginTestService;
  load(): Promise<void> {
    this.pluginTestService.appendText("Text2");
    return Promise.resolve();
  }
}
