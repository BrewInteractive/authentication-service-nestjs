import * as request from "supertest";

import { Any, DataSource, Repository, UpdateResult } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "./../src/app.module";
import { MockFactory } from "mockingbird";
import { RefreshToken } from "../src/entities";
import { RefreshTokenFixture } from "../test/fixtures";
import { faker } from "@faker-js/faker";
import { setupTestDataSourceAsync } from "./test-db";

describe("RefreshTokenController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let refreshTokenRepository: Repository<RefreshToken>;

  beforeAll(async () => {
    process.env.EMAIL_SERVICE = "aws";
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(await setupTestDataSourceAsync())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    refreshTokenRepository = moduleFixture.get<Repository<RefreshToken>>(
      "RefreshTokenRepository"
    );
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /refresh-token", () => {
    it("Should return a refresh token.", async () => {
      jest
        .spyOn(refreshTokenRepository, "findOne")
        .mockResolvedValue(
          Promise.resolve(MockFactory(RefreshTokenFixture).one().withUser())
        );

      jest
        .spyOn(refreshTokenRepository, "save")
        .mockResolvedValue(
          Promise.resolve(MockFactory(RefreshTokenFixture).one().withUser())
        );

      const response = await request(app.getHttpServer())
        .post("/refresh-token")
        .send({ refreshToken: faker.datatype.string() })
        .expect(201);

      expect(response.body).toHaveProperty("refresh_token");
      expect(response.body).toHaveProperty("id_token");
    });

    it("Should return 401 if invalid refresh token.", async () => {
      jest
        .spyOn(refreshTokenRepository, "findOne")
        .mockResolvedValue(Promise.resolve(null));

      await request(app.getHttpServer())
        .post("/refresh-token")
        .send({ refreshToken: faker.datatype.string() })
        .expect(401);
    });
  });
});
