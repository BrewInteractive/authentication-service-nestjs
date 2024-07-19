import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Otp, User } from "../../src/entities";
import {
  OtpFixture,
  SignUpOtpPhoneRequestFixture,
  UserFixture,
} from "../fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/filter/http-exception.filter";
import { MockFactory } from "mockingbird";
import { faker } from "@faker-js/faker";
import { setupTestDataSourceAsync } from "../test-db";

describe("SignUpOtpPhoneController (e2e)", () => {
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

  describe("POST /sign-up-otp-phone", () => {
    it("should return tokens if otp is valid and user does not exist", async () => {
      const signUpOtpPhoneRequest = MockFactory(
        SignUpOtpPhoneRequestFixture
      ).one();
      const createdOtp = MockFactory(OtpFixture)
        .mutate({
          channel: {
            phone: {
              phone_number: signUpOtpPhoneRequest.phone.number,
              country_code: signUpOtpPhoneRequest.phone.countryCode,
            },
          },
          value: signUpOtpPhoneRequest.otpValue,
        })
        .one();
      await otpRepository.save(createdOtp);

      const response = await request(app.getHttpServer())
        .post("/sign-up-otp-phone")
        .send(signUpOtpPhoneRequest)
        .expect(201);

      expect(response.body).toHaveProperty("idToken");
      expect(response.body).toHaveProperty("refreshToken");
    });

    it("should return Unauthorized error if user already exists", async () => {
      const createdUser = MockFactory(UserFixture).one();
      await userRepository.save(createdUser);

      const signUpOtpPhoneRequest = MockFactory(SignUpOtpPhoneRequestFixture)
        .mutate({
          phone: {
            number: String(createdUser.phoneNumber),
            countryCode: String(createdUser.countryCode),
          },
        })
        .one();

      const response = await request(app.getHttpServer())
        .post("/sign-up-otp-phone")
        .send(signUpOtpPhoneRequest)
        .expect(401);

      expect(response.body.message).toEqual("User is already exists.");
    });

    it("should return unauthorized error if otp is invalid", async () => {
      const signUpOtpPhoneRequest = MockFactory(
        SignUpOtpPhoneRequestFixture
      ).one();

      const response = await request(app.getHttpServer())
        .post("/sign-up-otp-phone")
        .send(signUpOtpPhoneRequest)
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials.");
    });

    it("should return unauthorized error if otp is expired", async () => {
      const signUpOtpPhoneRequest = MockFactory(
        SignUpOtpPhoneRequestFixture
      ).one();
      const expiredOtp = MockFactory(OtpFixture)
        .mutate({
          channel: {
            phone: {
              phone_number: signUpOtpPhoneRequest.phone.number,
              country_code: signUpOtpPhoneRequest.phone.countryCode,
            },
          },
          value: signUpOtpPhoneRequest.otpValue,
          expiresAt: faker.date.past(),
        })
        .one();
      await otpRepository.save(expiredOtp);

      const response = await request(app.getHttpServer())
        .post("/sign-up-otp-phone")
        .send(signUpOtpPhoneRequest)
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials.");
    });

    it("should return internal server error for unhandled errors", async () => {
      const signUpOtpPhoneRequest = MockFactory(
        SignUpOtpPhoneRequestFixture
      ).one();

      jest.spyOn(userRepository, "findOne").mockImplementationOnce(() => {
        throw new Error("mock error");
      });

      const response = await request(app.getHttpServer())
        .post("/sign-up-otp-phone")
        .send(signUpOtpPhoneRequest)
        .expect(500);

      expect(response.body.message).toEqual("Internal Server Error");
    });
  });
});
