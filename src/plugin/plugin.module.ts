import * as Plugins from "./plugins";

import { DynamicModule, Module } from "@nestjs/common";

import { AppService } from "../app.service";
import { PluginService } from "./plugin.service";

@Module({})
export class PluginModule {
  public static async registerAsync(): Promise<DynamicModule> {
    var pluginTypes = Object.values(Plugins);
    return {
      module: PluginModule,
      providers: [
        AppService,
        {
          provide: "PLUGINTYPES",
          useValue: pluginTypes,
        },
        PluginService,
        ...pluginTypes,
      ],
      exports: [PluginService, ...pluginTypes],
    };
  }
}
