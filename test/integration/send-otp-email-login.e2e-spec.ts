import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { LoginRequestFixture, OtpFixture, UserFixture } from "../fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { MockFactory } from "mockingbird";
import { User } from "../../src/entities/user.entity";
import { setupTestDataSourceAsync } from "../test-db";
import { Otp } from "../../src/entities";
import { SendLoginOtpEmailRequestFixture } from "../fixtures/login/send-otp-email-login-request.fixture";
import { faker } from "@faker-js/faker";

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
    await app.init();
    userRepository = moduleFixture.get<Repository<User>>("UserRepository");
    otpRepository = moduleFixture.get<Repository<Otp>>("OtpRepository");
  });

  afterEach(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /send-login-otp-email", () => {
    it("Should return send otp result when active otp exists", async () => {
      let user = MockFactory(UserFixture).one().hashPassword();
      let otp = MockFactory(OtpFixture).mutate({
        channel : { email : user.email },
        expiresAt: faker.date.future(),
      }).one();

      await userRepository.save(user);
      await otpRepository.save(otp);

      const sendLoginOtpEmailRequest = MockFactory(SendLoginOtpEmailRequestFixture).mutate({
          email: user.email,
        }).one();

      const responseEmail = await request(app.getHttpServer())
        .post("/send-login-otp-email")
        .send(sendLoginOtpEmailRequest)
        .expect(201);

      expect(responseEmail.body.isSent).toEqual(false);
      expect(new Date(responseEmail.body.expiresAt)).toEqual(new Date(otp.expiresAt));
    });

    it("Should return send otp result when no active otp exists", async () => {
        let user = MockFactory(UserFixture).one().hashPassword();
        await userRepository.save(user);
  
        const sendLoginOtpEmailRequest = MockFactory(SendLoginOtpEmailRequestFixture)
          .mutate({
            email: user.email,
          }).one();
  
        const responseEmail = await request(app.getHttpServer())
          .post("/send-login-otp-email")
          .send(sendLoginOtpEmailRequest)
          .expect(201);
  
        expect(responseEmail.body.isSent).toEqual(true);
        expect(responseEmail.body).toHaveProperty("expiresAt");
        expect(responseEmail.body).toHaveProperty("otpValue");
    });

    it("Should return unauthorized error when no user with given email exists", async () => {
        const sendLoginOtpEmailRequest = MockFactory(SendLoginOtpEmailRequestFixture).one();
  
        const response = await request(app.getHttpServer())
          .post("/send-login-otp-email")
          .send(sendLoginOtpEmailRequest)
          .expect(401);
  
        expect(response.body.message).toEqual("User doesn't exist.");
    });
  });
});
