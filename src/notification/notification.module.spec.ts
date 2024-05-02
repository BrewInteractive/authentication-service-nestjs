import { AutomapperModule } from "@automapper/nestjs";
import { ConfigFixture } from "../../test/fixtures";
import { ConfigModule } from "@nestjs/config";
import { MockFactory } from "mockingbird";
import { NotificationModule } from "./notification.module";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";

describe("NotificationModule", () => {
  let notificationModule: NotificationModule;

  beforeEach(async () => {
    const mockConfig = MockFactory(ConfigFixture).one();
    const app = await Test.createTestingModule({
      imports: [
        NotificationModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => mockConfig],
        }),
      ],
    }).compile();

    notificationModule = app.get<NotificationModule>(NotificationModule);
  });

  it("Should be defined", () => {
    expect(notificationModule).toBeDefined();
  });
});
