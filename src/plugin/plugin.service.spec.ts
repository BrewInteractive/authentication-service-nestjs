import * as Plugins from "./plugins";

import { Provider, forwardRef } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { Plugin } from "./interfaces/plugin.interface";
import { PluginService } from "./plugin.service";
import { PluginTestModule } from "../plugin-test/plugin-test.module";

describe("PluginService", () => {
  let service: PluginService;

  beforeEach(async () => {
    const pluginTypes: Provider<Plugin>[] = Object.values(Plugins);
    const module: TestingModule = await Test.createTestingModule({
      imports: [ PluginTestModule],
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
