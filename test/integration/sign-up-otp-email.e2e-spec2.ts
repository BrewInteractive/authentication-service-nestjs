import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Otp, User } from "../../src/entities";
import {
  OtpFixture,
  SignUpOtpEmailRequestFixture,
  UserFixture,
} from "../fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/filter/http-exception.filter";
import { MockFactory } from "mockingbird";
import { faker } from "@faker-js/faker";
import { setupTestDataSourceAsync } from "../test-db";

describe("SignUpOtpEmailController (e2e)", () => {
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
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
    userRepository = moduleFixture.get<Repository<User>>("UserRepository");
    otpRepository = moduleFixture.get<Repository<Otp>>("OtpRepository");
  });

  afterEach(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /sign-up-otp-email", () => {
    it("should return tokens if otp is valid and user does not exist", async () => {
      const signUpOtpEmailRequest = MockFactory(
        SignUpOtpEmailRequestFixture
      ).one();
      const createdOtp = MockFactory(OtpFixture)
        .mutate({
          channel: { email: signUpOtpEmailRequest.email },
          value: signUpOtpEmailRequest.otpValue,
        })
        .one();
      await otpRepository.save(createdOtp);

      const response = await request(app.getHttpServer())
        .post("/sign-up-otp-email")
        .send(signUpOtpEmailRequest)
        .expect(201);

      expect(response.body).toHaveProperty("idToken");
      expect(response.body).toHaveProperty("refreshToken");
    });

    it("should return tokens if otp is valid and user does not exist (with phone)", async () => {
      const signUpOtpEmailRequest = MockFactory(SignUpOtpEmailRequestFixture)
        .one()
        .withPhone();
      const createdOtp = MockFactory(OtpFixture)
        .mutate({
          channel: { email: signUpOtpEmailRequest.email },
          value: signUpOtpEmailRequest.otpValue,
        })
        .one();
      await otpRepository.save(createdOtp);

      const response = await request(app.getHttpServer())
        .post("/sign-up-otp-email")
        .send(signUpOtpEmailRequest)
        .expect(201);

      expect(response.body).toHaveProperty("idToken");
      expect(response.body).toHaveProperty("refreshToken");
    });

    it("should return User is already exists error if user already exists", async () => {
      const createdUser = MockFactory(UserFixture).one();
      await userRepository.save(createdUser);

      const signUpOtpEmailRequest = MockFactory(SignUpOtpEmailRequestFixture)
        .mutate({ email: createdUser.email })
        .one();

      const response = await request(app.getHttpServer())
        .post("/sign-up-otp-email")
        .send(signUpOtpEmailRequest)
        .expect(401);

      expect(response.body.message).toEqual("User is already exists.");
    });

    it("should return unauthorized error if otp is invalid", async () => {
      const signUpOtpEmailRequest = MockFactory(
        SignUpOtpEmailRequestFixture
      ).one();

      const response = await request(app.getHttpServer())
        .post("/sign-up-otp-email")
        .send(signUpOtpEmailRequest)
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials.");
    });

    it("should return unauthorized error if otp is expired", async () => {
      const signUpOtpEmailRequest = MockFactory(
        SignUpOtpEmailRequestFixture
      ).one();
      const expiredOtp = MockFactory(OtpFixture)
        .mutate({
          channel: { email: signUpOtpEmailRequest.email },
          value: signUpOtpEmailRequest.otpValue,
          expiresAt: faker.date.past(),
        })
        .one();
      await otpRepository.save(expiredOtp);

      const response = await request(app.getHttpServer())
        .post("/sign-up-otp-email")
        .send(signUpOtpEmailRequest)
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials.");
    });

    it("should return internal server error for unhandled errors", async () => {
      const signUpOtpEmailRequest = MockFactory(
        SignUpOtpEmailRequestFixture
      ).one();

      jest.spyOn(userRepository, "findOne").mockImplementationOnce(() => {
        throw new Error("mock error");
      });

      const response = await request(app.getHttpServer())
        .post("/sign-up-otp-email")
        .send(signUpOtpEmailRequest)
        .expect(500);

      expect(response.body.message).toEqual("Internal Server Error");
    });
  });
});
