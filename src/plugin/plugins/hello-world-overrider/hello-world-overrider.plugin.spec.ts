import { Test, TestingModule } from "@nestjs/testing";

import { AppService } from "../../../app.service";
import { HelloWorldOverriderPlugin } from "./hello-world-overrider.plugin";

describe("HelloWorldOverriderPlugin", () => {
  let service: HelloWorldOverriderPlugin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelloWorldOverriderPlugin, AppService],
    }).compile();

    service = module.get<HelloWorldOverriderPlugin>(HelloWorldOverriderPlugin);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
