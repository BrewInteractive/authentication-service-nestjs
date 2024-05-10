import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { RefreshToken, User } from "../../src/entities";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { MockFactory } from "mockingbird";
import { RefreshTokenFixture } from "../fixtures";
import { faker } from "@faker-js/faker";
import { setupTestDataSourceAsync } from "../test-db";

describe("RefreshTokenController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let refreshTokenRepository: Repository<RefreshToken>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
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
    userRepository = moduleFixture.get<Repository<User>>("UserRepository");
  });

  afterEach(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /refresh-token", () => {
    it("Should return a refresh token.", async () => {
      const refreshToken = faker.random.alphaNumeric(32);

      const refreshTokenFixture = MockFactory(RefreshTokenFixture)
        .mutate({
          refreshToken: refreshToken,
        })
        .one()
        .withUser();

      await userRepository.save(refreshTokenFixture.user);
      await refreshTokenRepository.save(refreshTokenFixture);

      const response = await request(app.getHttpServer())
        .post("/refresh-token")
        .send({ refreshToken: refreshToken })
        .expect(201);

      expect(response.body).toHaveProperty("refreshToken");
      expect(response.body).toHaveProperty("idToken");
    });

    it("Should return 401 if invalid refresh token.", async () => {
      await request(app.getHttpServer())
        .post("/refresh-token")
        .send({ refreshToken: faker.datatype.string() })
        .expect(401);
    });
  });
});
