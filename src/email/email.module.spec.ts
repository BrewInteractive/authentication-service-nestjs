import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { EmailConfigurationsFixture } from "../../test/fixtures";
import { EmailModule } from "./email.module";
import { MockFactory } from "mockingbird";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";

describe("EmailModule", () => {
  let emailModule: EmailModule;

  it("Should be defined (With AWS)", async () => {
    const emailConfigurations = () =>
      MockFactory(EmailConfigurationsFixture).one();
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [emailConfigurations],
        }),
        EmailModule,
      ],
    }).compile();

    emailModule = app.get<EmailModule>(EmailModule);
    expect(emailModule).toBeDefined();
  });

  it("Should be defined (With SMTP)", async () => {
    const emailConfigurations = () =>
      MockFactory(EmailConfigurationsFixture)
        .mutate({ emailService: "smtp" })
        .one();
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [emailConfigurations],
        }),
        EmailModule,
      ],
    }).compile();

    emailModule = app.get<EmailModule>(EmailModule);
    expect(emailModule).toBeDefined();
  });

  it("Should throw error", async () => {
    const emailConfigurations = () =>
      MockFactory(EmailConfigurationsFixture)
        .mutate({ emailService: "mock" })
        .one();
    const expectedError = new Error("Invalid email service type");
    await expect(
      Test.createTestingModule({
        imports: [
          AutomapperModule.forRoot({ strategyInitializer: classes() }),
          ConfigModule.forRoot({
            isGlobal: true,
            load: [emailConfigurations],
          }),
          EmailModule,
        ],
      }).compile()
    ).rejects.toThrow(expectedError);
  });
});
