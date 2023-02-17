import { Injectable, Inject, OnModuleInit, Type, Logger } from "@nestjs/common";

import { ModuleRef } from "@nestjs/core";

import { Plugin } from "./interfaces/plugin.interface";

@Injectable()
export class PluginService implements OnModuleInit {
  private readonly plugins: Plugin[];
  private readonly logger = new Logger(PluginService.name);
  constructor(
    @Inject("PLUGINTYPES") private pluginTypes: Type<Plugin>[],
    private moduleRef: ModuleRef
  ) {
    this.plugins = [];
  }
  async onModuleInit() {
    for (const pluginType of this.pluginTypes) {
      const plugin = await this.moduleRef.resolve(pluginType);
      try {
        await plugin.load();
        this.plugins.push(plugin);

        this.logger.log(`${plugin.displayName} plugin is loaded.`);
      } catch (error) {
        this.logger.error("Plugin can't be loaded: " + error);
      }
    }
  }
}
