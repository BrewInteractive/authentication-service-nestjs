import { AppModule } from "./app.module";
import { ConfigModule } from "@nestjs/config";
import { DataSource } from "typeorm";
import { Test } from "@nestjs/testing";
import { emailConfigurations } from "./config";
import { setupTestDataSourceAsync } from "../test/test-db";

describe("AppModule", () => {
  let appModule: AppModule;
  beforeEach(async () => {
    process.env.EMAIL_SERVICE = "aws";
    const app = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [emailConfigurations],
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
