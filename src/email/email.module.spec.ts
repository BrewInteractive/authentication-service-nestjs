import { AutomapperModule } from "@automapper/nestjs";
import { EmailModule } from "./email.module";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";

jest.mock("../utils/config", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    emailService: "aws",
  })),
}));

describe("EmailModule", () => {
  let emailModule: EmailModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        EmailModule,
      ],
    }).compile();

    emailModule = app.get<EmailModule>(EmailModule);
  });

  it("Should be defined", () => {
    expect(emailModule).toBeDefined();
  });
});
