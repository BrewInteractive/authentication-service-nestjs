import {} from "@nestjs/common";

import * as Plugins from "./plugins";

import { DynamicModule, Module, forwardRef } from "@nestjs/common";

import { AppModule } from "../app.module";
import { PluginService } from "./plugin.service";

@Module({
  imports: [forwardRef(() => AppModule)],
})
export class PluginModule {
  public static async registerAsync(): Promise<DynamicModule> {
    var pluginTypes = Object.values(Plugins);
    return {
      module: PluginModule,
      providers: [
        {
          provide: "PLUGINTYPES",
          useValue: pluginTypes,
        },
        PluginService,
        ...pluginTypes,
      ],
    };
  }
}
