import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Otp, User } from "../../src/entities";
import { OtpFixture, UserFixture } from "../fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/filter/http-exception.filter";
import { LoginOtpPhoneRequest } from "../../src/login/dto/login-otp-phone-request.dto";
import { MockFactory } from "mockingbird";
import { faker } from "@faker-js/faker";
import { setupTestDataSourceAsync } from "../test-db";

describe("LoginOtpPhoneController (e2e)", () => {
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

  describe("POST /login-otp-phone", () => {
    it("should return tokens if otp is valid", async () => {
      const createdUser = MockFactory(UserFixture).one().hashPassword();
      const createdOtp = MockFactory(OtpFixture)
        .mutate({
          channel: {
            phone: {
              phone_number: createdUser.phoneNumber!,
              country_code: createdUser.countryCode!,
            },
          },
        })
        .one();
      await userRepository.save(createdUser);
      await otpRepository.save(createdOtp);

      const response = await request(app.getHttpServer())
        .post("/login-otp-phone")
        .send({
          phone: {
            phoneNumber: createdUser.phoneNumber!,
            countryCode: createdUser.countryCode!,
          },
          otpValue: createdOtp.value,
        })
        .expect(201);

      expect(response.body).toHaveProperty("idToken");
      expect(response.body).toHaveProperty("refreshToken");
    });

    it("should return an error if OTP is invalid", async () => {
      const createdUser = MockFactory(UserFixture).one().hashPassword();
      const createdOtp = MockFactory(OtpFixture)
        .mutate({
          channel: {
            phone: {
              phone_number: createdUser.phoneNumber!,
              country_code: createdUser.countryCode!,
            },
          },
        })
        .one();
      await userRepository.save(createdUser);

      const response = await request(app.getHttpServer())
        .post("/login-otp-phone")
        .send({
          phone: {
            phoneNumber: createdUser.phoneNumber!,
            countryCode: createdUser.countryCode!,
          },
          otpValue: createdOtp.value,
        })
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials.");
    });

    it("should return an error if the otp is expired.", async () => {
      const createdUser = MockFactory(UserFixture).one().hashPassword();
      const unexpiredOtp = MockFactory(OtpFixture)
        .mutate({
          channel: {
            phone: {
              phone_number: createdUser.phoneNumber!,
              country_code: createdUser.countryCode!,
            },
          },
          expiresAt: faker.date.past(),
        })
        .one();
      await userRepository.save(createdUser);
      await otpRepository.save(unexpiredOtp);

      const response = await request(app.getHttpServer())
        .post("/login-otp-phone")
        .send({
          phone: {
            phoneNumber: createdUser.phoneNumber!,
            countryCode: createdUser.countryCode!,
          },
          otpValue: unexpiredOtp.value,
        })
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials.");
    });

    it("should return error if there is no user", async () => {
      const unexpiredOtp = MockFactory(OtpFixture).one().withPhoneChannel();
      await otpRepository.save(unexpiredOtp);

      const response = await request(app.getHttpServer())
        .post("/login-otp-phone")
        .send({
          phone: {
            phoneNumber: unexpiredOtp.channel.phone?.phone_number,
            countryCode: unexpiredOtp.channel.phone?.country_code,
          },
          otpValue: unexpiredOtp.value,
        } as LoginOtpPhoneRequest)
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials.");
    });
  });
});
