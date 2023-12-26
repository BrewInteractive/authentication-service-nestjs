import { AppModule } from "./app.module";
import { DataSource } from "typeorm";
import { Test } from "@nestjs/testing";
import { setupTestDataSourceAsync } from "../test/test-db";

jest.mock("./utils/config", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    emailService: "aws",
  })),
}));

describe("AppModule", () => {
  let appModule: AppModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [AppModule],
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