import { AutomapperModule } from "@automapper/nestjs";
import { ConfigFixture } from "../../test/fixtures/";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "./email.module";
import { EmailServiceType } from "./enum/email.service.type.enum";
import { MockFactory } from "mockingbird";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";

describe("EmailModule", () => {
  let emailModule: EmailModule;

  it("Should be defined (With AWS)", async () => {
    const mockConfig = MockFactory(ConfigFixture).one();
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => mockConfig],
        }),
        EmailModule,
      ],
    }).compile();

    emailModule = app.get<EmailModule>(EmailModule);
    expect(emailModule).toBeDefined();
  });

  it("Should be defined (With SMTP)", async () => {
    const mockConfig = MockFactory(ConfigFixture)
      .mutate({ emailService: EmailServiceType.SMTP })
      .one();
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => mockConfig],
        }),
        EmailModule,
      ],
    }).compile();

    emailModule = app.get<EmailModule>(EmailModule);
    expect(emailModule).toBeDefined();
  });

  it("Should throw error", async () => {
    const mockConfig = MockFactory(ConfigFixture)
      .mutate({ emailService: "mock" })
      .one();
    const expectedError = new Error("Invalid email service type");
    await expect(
      Test.createTestingModule({
        imports: [
          AutomapperModule.forRoot({ strategyInitializer: classes() }),
          ConfigModule.forRoot({
            isGlobal: true,
            load: [() => mockConfig],
          }),
          EmailModule,
        ],
      }).compile()
    ).rejects.toThrow(expectedError);
  });
});
