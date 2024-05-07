import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { EmailConfigFixture } from "../../test/fixtures";
import { EmailModule } from "./email.module";
import { MockFactory } from "mockingbird";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";

describe("EmailModule", () => {
  let emailModule: EmailModule;

  it("Should be defined (With AWS)", async () => {
    const emailConfig = () => MockFactory(EmailConfigFixture).one();
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [emailConfig],
        }),
        EmailModule,
      ],
    }).compile();

    emailModule = app.get<EmailModule>(EmailModule);
    expect(emailModule).toBeDefined();
  });

  it("Should be defined (With SMTP)", async () => {
    const emailConfig = () =>
      MockFactory(EmailConfigFixture).mutate({ emailService: "smtp" }).one();
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [emailConfig],
        }),
        EmailModule,
      ],
    }).compile();

    emailModule = app.get<EmailModule>(EmailModule);
    expect(emailModule).toBeDefined();
  });

  it("Should throw error", async () => {
    const emailConfig = () =>
      MockFactory(EmailConfigFixture).mutate({ emailService: "mock" }).one();
    const expectedError = new Error("Invalid email service type");
    await expect(
      Test.createTestingModule({
        imports: [
          AutomapperModule.forRoot({ strategyInitializer: classes() }),
          ConfigModule.forRoot({
            isGlobal: true,
            load: [emailConfig],
          }),
          EmailModule,
        ],
      }).compile()
    ).rejects.toThrow(expectedError);
  });
});
