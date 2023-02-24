import { Test, TestingModule } from "@nestjs/testing";
import { PluginTestService } from "./plugin-test.service";

describe("PluginTestService", () => {
  let service: PluginTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PluginTestService],
    }).compile();

    service = module.get<PluginTestService>(PluginTestService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
