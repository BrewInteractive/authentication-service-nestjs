import * as Plugins from "./plugins";

import { Test, TestingModule } from "@nestjs/testing";

import { BasePlugin } from "./abstract/base-plugin.plugin";
import { PluginService } from "./plugin.service";
import { PluginTestModule } from "../plugin-test/plugin-test.module";
import { Provider } from "@nestjs/common";
import { TokenModule } from "../token/token.module";

describe("PluginService", () => {
  let service: PluginService;

  beforeEach(async () => {
    const pluginTypes: Provider<BasePlugin>[] = Object.values(Plugins);
    const module: TestingModule = await Test.createTestingModule({
      imports: [PluginTestModule],
      providers: [
        {
          provide: "PLUGINTYPES",
          useValue: pluginTypes,
        },
        PluginService,
        ...pluginTypes,
      ],
    }).compile();

    service = module.get<PluginService>(PluginService);
  });

  it("Should be defined", () => {
    expect(service).toBeDefined();
  });
});
