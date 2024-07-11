import { EmailConfigFixture, SmsConfigFixture } from "../../test/fixtures";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { MockFactory } from "mockingbird";
import { AuthNotificationModule } from "./auth-notification.module";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";

describe("AuthNotificationModule", () => {
  let authNotificationModule: AuthNotificationModule;

  beforeEach(async () => {
    const mockEmailConfig = MockFactory(EmailConfigFixture).one();
    const mockSmsConfig = MockFactory(SmsConfigFixture).one();
    const app = await Test.createTestingModule({
      imports: [
        AuthNotificationModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => mockEmailConfig, () => mockSmsConfig],
        }),
      ],
    }).compile();

    authNotificationModule = app.get<AuthNotificationModule>(
      AuthNotificationModule
    );
  });

  it("Should be defined", () => {
    expect(authNotificationModule).toBeDefined();
  });
});
