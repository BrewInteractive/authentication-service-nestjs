import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Otp, User } from "../../src/entities";
import { OtpFixture, UserFixture } from "../fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { MockFactory } from "mockingbird";
import { faker } from "@faker-js/faker";
import { setupTestDataSourceAsync } from "../test-db";

describe("LoginOtpEmailController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;
  let otpRepository: Repository<Otp>;

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
    userRepository = moduleFixture.get<Repository<User>>("UserRepository");
    otpRepository = moduleFixture.get<Repository<Otp>>("OtpRepository");
  });

  afterEach(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /login-otp-email", () => {
    it("should return tokens if otp is valid", async () => {
      const createdUser = MockFactory(UserFixture).one().hashPassword();
      const createdOtp = MockFactory(OtpFixture)
        .mutate({ channel: { email: createdUser.email } })
        .one();
      await userRepository.save(createdUser);
      await otpRepository.save(createdOtp);

      const response = await request(app.getHttpServer())
        .post("/login-otp-email")
        .send({
          email: createdUser.email,
          otpValue: createdOtp.value,
        })
        .expect(201);

      expect(response.body).toHaveProperty("id_token");
      expect(response.body).toHaveProperty("refresh_token");
    });

    it("should return an error if OTP is invalid", async () => {
      const createdUser = MockFactory(UserFixture).one().hashPassword();
      const createdOtp = MockFactory(OtpFixture)
        .mutate({ channel: { email: createdUser.email } })
        .one();
      await userRepository.save(createdUser);

      const response = await request(app.getHttpServer())
        .post("/login-otp-email")
        .send({
          email: createdUser.email,
          otpValue: createdOtp.value,
        })
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials");
    });

    it("should return an error if the otp is expired.", async () => {
      const createdUser = MockFactory(UserFixture).one().hashPassword();
      const unexpiredOtp = MockFactory(OtpFixture)
        .mutate({
          channel: { email: createdUser.email },
          expiresAt: faker.date.past(),
        })
        .one();
      await userRepository.save(createdUser);
      await otpRepository.save(unexpiredOtp);

      const response = await request(app.getHttpServer())
        .post("/login-otp-email")
        .send({
          email: createdUser.email,
          otpValue: unexpiredOtp.value,
        })
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials");
    });

    it("should return error if there is no user", async () => {
      const createdUser = MockFactory(UserFixture).one().hashPassword();
      const unexpiredOtp = MockFactory(OtpFixture)
        .mutate({
          channel: { email: createdUser.email },
        })
        .one();
      await otpRepository.save(unexpiredOtp);

      const response = await request(app.getHttpServer())
        .post("/login-otp-email")
        .send({
          email: createdUser.email,
          otpValue: unexpiredOtp.value,
        })
        .expect(404);

      expect(response.body.message).toEqual("Invalid credentials");
    });
  });
});
