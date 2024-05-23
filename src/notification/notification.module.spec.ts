import { EmailConfigFixture, SmsConfigFixture } from "../../test/fixtures";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { MockFactory } from "mockingbird";
import { NotificationModule } from "./notification.module";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";

describe("NotificationModule", () => {
  let notificationModule: NotificationModule;

  beforeEach(async () => {
    const mockEmailConfig = MockFactory(EmailConfigFixture).one();
    const mockSmsConfig = MockFactory(SmsConfigFixture).one();
    const app = await Test.createTestingModule({
      imports: [
        NotificationModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => mockEmailConfig, () => mockSmsConfig],
        }),
      ],
    }).compile();

    notificationModule = app.get<NotificationModule>(NotificationModule);
  });

  it("Should be defined", () => {
    expect(notificationModule).toBeDefined();
  });
});
