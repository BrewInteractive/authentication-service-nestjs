import { AutomapperModule } from "@automapper/nestjs";
import { ConfigFixture } from "../../test/fixtures/";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "./email.module";
import { MockFactory } from "mockingbird";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";

describe("EmailModule", () => {
  let emailModule: EmailModule;

  it("Should be defined", async () => {
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

  it("Should throw error", async () => {
    const expectedError = new Error("Invalid email service type");
    await expect(
      Test.createTestingModule({
        imports: [
          AutomapperModule.forRoot({ strategyInitializer: classes() }),
          ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({})],
          }),
          EmailModule,
        ],
      }).compile()
    ).rejects.toThrow(expectedError);
  });
});
