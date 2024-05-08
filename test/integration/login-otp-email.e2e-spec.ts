import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Otp, User } from "../../src/entities";
import { OtpFixture, UserFixture } from "../fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { LoginOtpEmailRequest } from "../../src/login/dto/login-otp-email-request.dto";
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
    it("Should return a token if OTP credentials are valid", async () => {
      const mockUser = MockFactory(UserFixture).one().hashPassword();
      const mockOtp = MockFactory(OtpFixture)
        .mutate({ channel: { email: mockUser.email } })
        .one();
      await userRepository.save(mockUser);
      await otpRepository.save(mockOtp);

      const response = await request(app.getHttpServer())
        .post("/login-otp-email")
        .send({
          email: mockUser.email,
          otpValue: mockOtp.value,
        })
        .expect(201);

      expect(response.body).toHaveProperty("id_token");
      expect(response.body).toHaveProperty("refresh_token");
    });

    it("should return an error if OTP is invalid", async () => {
      const mockUser = MockFactory(UserFixture).one().hashPassword();
      const mockOtp = MockFactory(OtpFixture)
        .mutate({ channel: { email: mockUser.email } })
        .one();
      await userRepository.save(mockUser);

      const response = await request(app.getHttpServer())
        .post("/login-otp-email")
        .send({
          email: mockUser.email,
          otpValue: mockOtp.value,
        })
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials");
    });

    it("If the OTP time has expired, it should return an error", async () => {
      const mockUser = MockFactory(UserFixture).one().hashPassword();
      const mockOtp = MockFactory(OtpFixture)
        .mutate({
          channel: { email: mockUser.email },
          expiresAt: faker.date.past(),
        })
        .one();
      await userRepository.save(mockUser);
      await otpRepository.save(mockOtp);

      const response = await request(app.getHttpServer())
        .post("/login-otp-email")
        .send({
          email: mockUser.email,
          otpValue: mockOtp.value,
        })
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials");
    });
  });
});
