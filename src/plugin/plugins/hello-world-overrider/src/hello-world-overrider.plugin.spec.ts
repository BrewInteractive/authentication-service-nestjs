import { Test, TestingModule } from "@nestjs/testing";

import { HelloWorldOverriderPlugin } from "../src/hello-world-overrider.plugin";
import { PluginTestModule } from "../../../../plugin-test/plugin-test.module";
import { PluginTestService } from "../../../../plugin-test/plugin-test.service";

describe("HelloWorldOverriderPlugin", () => {
  let plugin: HelloWorldOverriderPlugin;
  let pluginTestService: PluginTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PluginTestModule],
      providers: [HelloWorldOverriderPlugin],
    }).compile();

    plugin = module.get<HelloWorldOverriderPlugin>(HelloWorldOverriderPlugin);
    await plugin.load();
    pluginTestService = module.get<PluginTestService>("PluginTestService");
  });

  it("should be defined", () => {
    expect(plugin).toBeDefined();
  });

  it("should override getHelloWorld method of PluginTestService", () => {
    expect(pluginTestService.getHelloWorld()).toBe("Hello World overriden!");
  });

  it("should override getHello method of PluginTestService", () => {
    expect(pluginTestService.getHello()).toBe("Hello World overriden!Text1");
  });
});
