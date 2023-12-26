import { TemplateModule } from "./template.module";
import { Test } from "@nestjs/testing";

describe("TemplateModule", () => {
  let templateModule: TemplateModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [TemplateModule],
    }).compile();

    templateModule = app.get<TemplateModule>(TemplateModule);
  });

  it("Should be defined", () => {
    expect(templateModule).toBeDefined();
  });
});
