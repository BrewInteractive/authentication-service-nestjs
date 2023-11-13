import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "./../src/app.module";
import { MockFactory } from "mockingbird";
import { setupTestDataSourceAsync } from "./test-db";

import { User, UserResetPasswordRequest } from "../src/entities";
import { faker } from "@faker-js/faker";
import {
  ResetPasswordFixture,
  UserResetPasswordRequestFixture,
  UserFixture,
} from "./fixtures";

describe("ResetPassword (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userResetPasswordRequestRepository: Repository<UserResetPasswordRequest>;
  let userRepository: Repository<User>;
  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(await setupTestDataSourceAsync())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    userResetPasswordRequestRepository = moduleFixture.get<
      Repository<UserResetPasswordRequest>
    >("UserResetPasswordRequestRepository");
    userRepository = moduleFixture.get<Repository<User>>("UserRepository");
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /reset-password", () => {
    it("should reset the password when a valid reset request is provided", async () => {
      const userId = faker.datatype.string();
      const validKey = faker.datatype.string(16);

      const resetPasswordRequest = MockFactory(ResetPasswordFixture)
        .mutate({
          key: validKey,
          userId: userId,
        })
        .one();

      const userResetPasswordData = MockFactory(
        UserResetPasswordRequestFixture
      )
        .mutate({
          key: validKey,
          expiresAt: faker.date.future(1),
          user: MockFactory(UserFixture)
            .mutate({
              id: String(userId),
            })
            .one(),
        })
        .one();

      jest
        .spyOn(userResetPasswordRequestRepository, "findOne")
        .mockResolvedValue(Promise.resolve(userResetPasswordData));

      jest
        .spyOn(userResetPasswordRequestRepository, "save")
        .mockResolvedValue(Promise.resolve(userResetPasswordData));

      jest
        .spyOn(userRepository, "save")
        .mockResolvedValue(Promise.resolve(MockFactory(UserFixture).one()));

      const response = await request(app.getHttpServer())
        .post("/reset-password")
        .send(resetPasswordRequest)
        .expect(201);

      expect(response.text).toBe("OK");
    });

    it("should return an error for an invalid user for the reset request", async () => {
      const userId = faker.datatype.string();

      const resetPasswordRequest = MockFactory(ResetPasswordFixture)
        .mutate({
          userId: userId,
        })
        .one();

      const userResetPasswordData = MockFactory(
        UserResetPasswordRequestFixture
      )
        .mutate({
          expiresAt: faker.date.future(1),
          user: MockFactory(UserFixture).one(),
        })
        .one();

      jest
        .spyOn(userResetPasswordRequestRepository, "findOne")
        .mockResolvedValue(Promise.resolve(userResetPasswordData));

      const response = await request(app.getHttpServer())
        .post("/reset-password")
        .send(resetPasswordRequest)
        .expect(401);

      expect(response.body.message).toBe("Invalid reset password request.");
    });
  });
});
