import { Test, TestingModule } from "@nestjs/testing";

import { PluginTestModule } from "../../../../plugin-test/plugin-test.module";
import { PluginTestService } from "../../../../plugin-test/plugin-test.service";
import { Text2AppenderPlugin } from "../src/text2-appender.plugin";

describe("Text2AppenderPlugin", () => {
  let plugin: Text2AppenderPlugin;
  let pluginTestService: PluginTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PluginTestModule],
      providers: [Text2AppenderPlugin],
    }).compile();

    plugin = module.get<Text2AppenderPlugin>(Text2AppenderPlugin);
    plugin.load();
    pluginTestService = module.get<PluginTestService>(PluginTestService);
  });

  it("should be defined", () => {
    expect(plugin).toBeDefined();
  });

  it("should override getHello method of PluginTestService", () => {
    expect(pluginTestService.getHello()).toBe("Hello World!Text2");
  });
});
