import { Injectable, Inject, OnModuleInit, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { Plugin } from "../plugin/interfaces/plugin.interface";

@Injectable()
export class PluginService implements OnModuleInit {
  private plugins: Plugin[];
  constructor(
    @Inject("PLUGINTYPES") private pluginTypes: Type<Plugin>[],
    private moduleRef: ModuleRef
  ) {}
  async onModuleInit() {
    for (const pluginType of this.pluginTypes) {
      var plugin = await this.moduleRef.resolve(pluginType);
      try {
        await plugin.load();
        this.plugins.push(plugin);
      } catch (error) {
        console.warn("Plugin can't be loaded: " + error);
      }
    }
  }
}
