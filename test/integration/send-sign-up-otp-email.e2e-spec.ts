import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { SendSignUpOtpEmailRequestFixture, UserFixture } from "../fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/filter/http-exception.filter";
import { MockFactory } from "mockingbird";
import { Otp } from "../../src/entities";
import { User } from "../../src/entities/user.entity";
import { setupTestDataSourceAsync } from "../test-db";

describe("SendSignUpOtpEmailController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
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
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
    userRepository = moduleFixture.get<Repository<User>>("UserRepository");
  });

  afterEach(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /send-sign-up-otp-email", () => {
    it("should return send otp result when no user with given email exists", async () => {
      const sendSignUpOtpEmailRequest = MockFactory(
        SendSignUpOtpEmailRequestFixture
      ).one();

      const response = await request(app.getHttpServer())
        .post("/send-sign-up-otp-email")
        .send(sendSignUpOtpEmailRequest)
        .expect(201);

      expect(response.body.isSent).toEqual(true);
      expect(new Date(response.body.expiresAt).getTime()).toBeGreaterThan(
        new Date().getTime()
      );
    });

    it("should return already exists error when user with given email already exists", async () => {
      const user = MockFactory(UserFixture).one();
      await userRepository.save(user);

      const sendSignUpOtpEmailRequest = MockFactory(
        SendSignUpOtpEmailRequestFixture
      )
        .mutate({
          email: user.email,
        })
        .one();

      const response = await request(app.getHttpServer())
        .post("/send-sign-up-otp-email")
        .send(sendSignUpOtpEmailRequest)
        .expect(409);

      expect(response.body.message).toEqual("User is already exists.");
    });

    it("should return send otp result when no active otp exists", async () => {
      const sendSignUpOtpEmailRequest = MockFactory(
        SendSignUpOtpEmailRequestFixture
      ).one();

      const response = await request(app.getHttpServer())
        .post("/send-sign-up-otp-email")
        .send(sendSignUpOtpEmailRequest)
        .expect(201);

      expect(response.body.isSent).toEqual(true);
      expect(new Date(response.body.expiresAt).getTime()).toBeGreaterThan(
        new Date().getTime()
      );
    });
  });
});
