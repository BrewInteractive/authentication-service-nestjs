import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import {
  ResetPasswordFixture,
  UserFixture,
  UserResetPasswordRequestFixture,
} from "../fixtures";
import { Test, TestingModule } from "@nestjs/testing";
import { User, UserResetPasswordRequest } from "../../src/entities";

import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/filter/http-exception.filter";
import { MockFactory } from "mockingbird";
import { faker } from "@faker-js/faker";
import { setupTestDataSourceAsync } from "../test-db";

describe("ResetPassword (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userResetPasswordRequestRepository: Repository<UserResetPasswordRequest>;
  let userRepository: Repository<User>;

  const validPassword = "Password1@";

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(await setupTestDataSourceAsync())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
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
      const email = faker.internet.email();
      const validKey = faker.string.sample(16);

      const resetPasswordRequest = MockFactory(ResetPasswordFixture)
        .mutate({
          key: validKey,
          email: email,
          newPassword: validPassword,
        })
        .one();
      const user = MockFactory(UserFixture)
        .mutate({
          email: email,
        })
        .one();
      const expectedResponse = { result: "OK" };

      const savedUser = await userRepository.save(user);

      const userResetPasswordData = MockFactory(UserResetPasswordRequestFixture)
        .mutate({
          key: validKey,
          expiresAt: faker.date.future({ years: 1 }),
          user: savedUser,
        })
        .one() as UserResetPasswordRequest;

      await userResetPasswordRequestRepository.save(userResetPasswordData);

      const response = await request(app.getHttpServer())
        .post("/reset-password")
        .send(resetPasswordRequest)
        .expect(201);

      expect(response.body).toEqual(expectedResponse);
    });

    it("should return an error if the user is invalid", async () => {
      const email = faker.internet.email();
      const validKey = faker.string.sample(16);

      const resetPasswordRequest = MockFactory(ResetPasswordFixture)
        .mutate({
          key: validKey,
          email: email,
          newPassword: validPassword,
        })
        .one();

      const response = await request(app.getHttpServer())
        .post("/reset-password")
        .send(resetPasswordRequest)
        .expect(400);

      expect(response.body.message).toBe("Invalid reset password request.");
    });
  });
});
