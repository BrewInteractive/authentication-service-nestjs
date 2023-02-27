import { Inject, Injectable, Logger, OnModuleInit, Type } from "@nestjs/common";

import { IPlugin } from "./interfaces/plugin.interface";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class PluginService implements OnModuleInit {
  private readonly plugins: IPlugin[];
  private readonly logger = new Logger(PluginService.name);
  constructor(
    @Inject("PLUGINTYPES") private pluginTypes: Type<IPlugin>[],
    private moduleRef: ModuleRef
  ) {
    this.plugins = [];
  }
  async onModuleInit() {
    for (const pluginType of this.pluginTypes) {
      const plugin = this.moduleRef.get(pluginType);
      try {
        await plugin.load();
        this.plugins.push(plugin);

        this.logger.log(`${plugin.displayName} plugin is loaded.`);
      } catch (error) {
        this.logger.warn(
          `${plugin.displayName} plugin can't be loaded.: ${error}`
        );
      }
    }
  }
}
