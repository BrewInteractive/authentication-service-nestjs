import * as request from "supertest";

import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { DataSource } from "typeorm";
import { INestApplication } from "@nestjs/common";
import { setupTestDataSourceAsync } from "../test-db";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(await setupTestDataSourceAsync())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Brew Authentication Api is running...");
  });
});
