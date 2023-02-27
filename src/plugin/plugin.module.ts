import * as Plugins from "./plugins";

import { DynamicModule, Module, Provider, forwardRef } from "@nestjs/common";

import { AppModule } from "../app.module";
import { IPlugin } from "./interfaces/plugin.interface";
import { PluginService } from "./plugin.service";
import { PluginTestModule } from "../plugin-test/plugin-test.module";

@Module({
  imports: [forwardRef(() => AppModule), forwardRef(() => PluginTestModule)],
})
export class PluginModule {
  public static async registerAsync(): Promise<DynamicModule> {
    const pluginTypes: Provider<IPlugin>[] = Object.values(Plugins);
    return {
      module: PluginModule,
      providers: [
        PluginService,
        {
          provide: "PLUGINTYPES",
          useValue: pluginTypes,
        },
        ...pluginTypes,
      ],
    };
  }
}
