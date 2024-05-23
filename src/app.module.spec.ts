import { AppModule } from "./app.module";
import { ConfigModule } from "@nestjs/config";
import { DataSource } from "typeorm";
import { Test } from "@nestjs/testing";
import { emailConfig } from "./config";
import { setupTestDataSourceAsync } from "../test/test-db";
import { smsConfig } from "./config/sms.config";

describe("AppModule", () => {
  let appModule: AppModule;
  beforeEach(async () => {
    process.env.EMAIL_SERVICE = "aws";
    process.env.SMS_SERVICE = "mutlucell";
    const app = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [emailConfig, smsConfig],
        }),
      ],
    })
      .overrideProvider(DataSource)
      .useValue(await setupTestDataSourceAsync())
      .compile();

    appModule = app.get<AppModule>(AppModule);
  });

  it("Should be defined", () => {
    expect(appModule).toBeDefined();
  });
});
