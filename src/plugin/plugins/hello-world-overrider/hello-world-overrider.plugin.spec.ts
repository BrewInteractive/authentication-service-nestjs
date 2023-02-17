import { Test, TestingModule } from "@nestjs/testing";

import { HelloWorldOverriderPlugin } from "./hello-world-overrider.plugin";
import { PluginTestModule } from "../../../plugin-test/plugin-test.module";

describe("HelloWorldOverriderPlugin", () => {
  let service: HelloWorldOverriderPlugin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PluginTestModule],
      providers: [HelloWorldOverriderPlugin],
    }).compile();

    service = module.get<HelloWorldOverriderPlugin>(HelloWorldOverriderPlugin);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
