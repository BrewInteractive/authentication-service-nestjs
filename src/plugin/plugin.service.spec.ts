import * as Plugins from "./plugins";

import { Test, TestingModule } from "@nestjs/testing";

import { Plugin } from "./interfaces/plugin.interface";
import { PluginService } from "./plugin.service";
import { Provider } from "@nestjs/common";

describe("PluginService", () => {
  let service: PluginService;

  beforeEach(async () => {
    const pluginTypes: Provider<Plugin>[] = Object.values(Plugins);
    const module: TestingModule = await Test.createTestingModule({
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

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
