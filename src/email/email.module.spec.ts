import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { EMAIL_CONFIGURATIONS } from "../config";
import { EmailModule } from "./email.module";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";

describe("EmailModule", () => {
  let emailModule: EmailModule;

  it("Should be defined (With AWS)", async () => {
    process.env.EMAIL_SERVICE = "aws";
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [EMAIL_CONFIGURATIONS],
        }),
        EmailModule,
      ],
    }).compile();

    emailModule = app.get<EmailModule>(EmailModule);
    expect(emailModule).toBeDefined();
  });

  it("Should be defined (With SMTP)", async () => {
    process.env.EMAIL_SERVICE = "smtp";
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({ strategyInitializer: classes() }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [EMAIL_CONFIGURATIONS],
        }),
        EmailModule,
      ],
    }).compile();

    emailModule = app.get<EmailModule>(EmailModule);
    expect(emailModule).toBeDefined();
  });

  it("Should throw error", async () => {
    process.env.EMAIL_SERVICE = "mock";
    const expectedError = new Error("Invalid email service type");
    await expect(
      Test.createTestingModule({
        imports: [
          AutomapperModule.forRoot({ strategyInitializer: classes() }),
          ConfigModule.forRoot({
            isGlobal: true,
            load: [EMAIL_CONFIGURATIONS],
          }),
          EmailModule,
        ],
      }).compile()
    ).rejects.toThrow(expectedError);
  });
});
