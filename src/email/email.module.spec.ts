import { AutomapperModule } from "@automapper/nestjs";
import { EmailModule } from "./email.module";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";
import { ConfigFixture } from "../../test/fixtures/";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MockFactory } from "mockingbird";

describe("EmailModule", () => {
  let emailModule: EmailModule;
  let configService: ConfigService;
  it("Should be defined", async () => {
    const mockConfig = MockFactory(ConfigFixture).one();
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        EmailModule,
      ],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case "emailService":
                  return "aws";
              }
            }),
          },
        },
      ],
    }).compile();

    configService = app.get<ConfigService>(ConfigService);
    emailModule = app.get<EmailModule>(EmailModule);
    expect(emailModule).toBeDefined();
  });

  /* it("Should throw error", async () => {
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
  });*/
});
