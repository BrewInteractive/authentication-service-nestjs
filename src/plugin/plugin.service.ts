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
      var plugin = this.moduleRef.get(pluginType);
      try {
        await plugin.setup();
        this.plugins.push(plugin);
      } catch {}
    }
  }
}
