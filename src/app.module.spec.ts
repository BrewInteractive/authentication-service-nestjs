import { AppModule } from "./app.module";
import { ConfigModule } from "@nestjs/config";
import { DataSource } from "typeorm";
import { EMAIL_CONFIGURATIONS } from "./config";
import { Test } from "@nestjs/testing";
import { setupTestDataSourceAsync } from "../test/test-db";

describe("AppModule", () => {
  let appModule: AppModule;
  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [EMAIL_CONFIGURATIONS],
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
