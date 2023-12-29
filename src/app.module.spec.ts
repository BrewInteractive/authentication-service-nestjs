import { AppModule } from "./app.module";
import { DataSource } from "typeorm";
import { Test } from "@nestjs/testing";
import { setupTestDataSourceAsync } from "../test/test-db";
import { ConfigModule } from "@nestjs/config";
import { MockFactory } from "mockingbird";
import { ConfigFixture } from "../test/fixtures";

describe("AppModule", () => {
  let appModule: AppModule;
  const mockConfig = MockFactory(ConfigFixture).one();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => mockConfig],
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