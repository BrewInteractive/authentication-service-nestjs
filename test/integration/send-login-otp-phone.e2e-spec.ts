import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import {
  OtpFixture,
  PhoneRequestFixture,
  SendLoginOtpPhoneRequestFixture,
  UserFixture,
} from "../fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/filter/http-exception.filter";
import { MockFactory } from "mockingbird";
import { Otp } from "../../src/entities";
import { User } from "../../src/entities/user.entity";
import { faker } from "@faker-js/faker";
import { setupTestDataSourceAsync } from "../test-db";

describe("SendLoginOtpEmailController (e2e)", () => {
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

  describe("POST /send-login-otp-phone", () => {
    it("should return send otp result when active otp exists", async () => {
      let user = MockFactory(UserFixture).one().hashPassword();
      let otp = MockFactory(OtpFixture)
        .mutate({
          channel: {
            phone: {
              phone_number: user.phoneNumber!,
              country_code: user.countryCode!,
            },
          },
          expiresAt: faker.date.future(),
        })
        .one();

      await userRepository.save(user);
      await otpRepository.save(otp);

      const phone = MockFactory(PhoneRequestFixture)
        .mutate({
          number: user.phoneNumber,
          countryCode: user.countryCode,
        })
        .one();

      const sendLoginOtpPhoneRequest = MockFactory(
        SendLoginOtpPhoneRequestFixture
      )
        .mutate({
          phone: phone,
        })
        .one();

      const responseEmail = await request(app.getHttpServer())
        .post("/send-login-otp-phone")
        .send(sendLoginOtpPhoneRequest)
        .expect(201);

      expect(responseEmail.body.isSent).toEqual(false);
      expect(new Date(responseEmail.body.expiresAt)).toEqual(
        new Date(otp.expiresAt)
      );
    });

    it("should return send otp result when no active otp exists", async () => {
      let user = MockFactory(UserFixture).one().hashPassword();
      await userRepository.save(user);

      const phone = MockFactory(PhoneRequestFixture)
        .mutate({
          number: user.phoneNumber,
          countryCode: user.countryCode,
        })
        .one();

      const sendLoginOtpPhoneRequest = MockFactory(
        SendLoginOtpPhoneRequestFixture
      )
        .mutate({
          phone: phone,
        })
        .one();

      const responseEmail = await request(app.getHttpServer())
        .post("/send-login-otp-phone")
        .send(sendLoginOtpPhoneRequest)
        .expect(201);

      expect(responseEmail.body.isSent).toEqual(true);
      expect(new Date(responseEmail.body.expiresAt).getTime()).toBeGreaterThan(
        new Date().getTime()
      );
    });

    it("should return fake otp result when no user with given email exists", async () => {
      const sendLoginOtpPhoneRequest = MockFactory(
        SendLoginOtpPhoneRequestFixture
      ).one();

      const response = await request(app.getHttpServer())
        .post("/send-login-otp-phone")
        .send(sendLoginOtpPhoneRequest)
        .expect(201);

      expect(response.body).toHaveProperty("expiresAt");
      expect(response.body).toHaveProperty("isSent");
    });
  });
});
