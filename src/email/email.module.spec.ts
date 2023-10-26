import { AutomapperModule } from "@automapper/nestjs";
import { EmailModule } from "./email.module";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";
import config from "../utils/config";

jest.mock("../utils/config", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    emailService: "aws",
  })),
}));

describe("EmailModule", () => {
  let emailModule: EmailModule;

  it("Should be defined", async () => {
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        EmailModule,
      ],
    }).compile();

    emailModule = app.get<EmailModule>(EmailModule);
    expect(emailModule).toBeDefined();
  });

  it("Should throw error", async () => {
    (config as jest.Mock).mockImplementation(() => ({
      emailService: "invalid",
    }));
    const expectedError = new Error("Invalid email service type");
    await expect(
      Test.createTestingModule({
        imports: [
          AutomapperModule.forRoot({ strategyInitializer: classes() }),
          EmailModule,
        ],
      }).compile()
    ).rejects.toThrow(expectedError);
  });
});
