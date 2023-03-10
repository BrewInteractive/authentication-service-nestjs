import { Test, TestingModule } from "@nestjs/testing";

import { PluginTestController } from "./plugin-test.controller";
import { PluginTestService } from "./plugin-test.service";

describe("PluginTestController", () => {
  let controller: PluginTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PluginTestController],
      providers: [
        { provide: "PluginTestService", useClass: PluginTestService },
      ],
    }).compile();

    controller = module.get<PluginTestController>(PluginTestController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it('should return "Hello World!"', () => {
    expect(controller.getHello()).toBe("Hello World!");
  });
});
