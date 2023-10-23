import * as Plugins from "./plugins";

import { DynamicModule, Module, Provider, forwardRef } from "@nestjs/common";

import { AppModule } from "../app.module";
import { BasePlugin } from "./abstract/base-plugin.plugin";
import { PluginService } from "./plugin.service";
import { PluginTestModule } from "../plugin-test/plugin-test.module";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [
    forwardRef(() => AppModule),
    forwardRef(() => PluginTestModule),
    forwardRef(() => TokenModule),
  ],
})
export class PluginModule {
  public static async registerAsync(): Promise<DynamicModule> {
    const pluginTypes: Provider<BasePlugin>[] = Object.values(Plugins);
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
