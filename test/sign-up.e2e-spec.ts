import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { SignUpFixture, UserFixture } from "../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "./../src/app.module";
import { MockFactory } from "mockingbird";
import { User } from "../src/entities/user.entity";
import { setupTestDataSourceAsync } from "./test-db";

const bcrypt = require("bcrypt");

describe("SignUpController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    process.env.EMAIL_SERVICE = "aws";
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
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /sign-up", () => {
    it("should create a new user and return a token", async () => {
      const signUpDto = MockFactory(SignUpFixture)
        .mutate({
          email: "test@test.com",
          username: "testUser",
          password: "TestPassword1!",
        })
        .one();

      const response = await request(app.getHttpServer())
        .post("/sign-up")
        .send(signUpDto)
        .expect(201);

      expect(response.body).toHaveProperty("id_token");
      expect(response.body).toHaveProperty("refresh_token");
    });

    it("should return 409 if email already exists", async () => {
      const signUpDto = MockFactory(SignUpFixture)
        .mutate({
          email: "test@test.com",
        })
        .one();

      jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(Promise.resolve(MockFactory(UserFixture).one()));

      const response = await request(app.getHttpServer())
        .post("/sign-up")
        .send(signUpDto)
        .expect(409);

      expect(response.body.message).toEqual("Username or email already exists");
    });

    it("should return 409 if username already exists", async () => {
      const signUpDto = MockFactory(SignUpFixture)
        .mutate({
          username: "testUser",
        })
        .one();

      jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(Promise.resolve(MockFactory(UserFixture).one()));

      const response = await request(app.getHttpServer())
        .post("/sign-up")
        .send(signUpDto)
        .expect(409);

      expect(response.body.message).toEqual("Username or email already exists");
    });

    it("should return 400 if email is invalid", async () => {
      const signUpDto = MockFactory(SignUpFixture)
        .mutate({
          email: "inv-email",
        })
        .one();
      signUpDto.username = null;

      const response = await request(app.getHttpServer())
        .post("/sign-up")
        .send(signUpDto)
        .expect(400);

      expect(response.body.message).toEqual(["email must be an email"]);
    });

    it("should return 400 if password is too short", async () => {
      const signUpDto = MockFactory(SignUpFixture)
        .mutate({
          password: "TPass",
        })
        .one();
      const response = await request(app.getHttpServer())
        .post("/sign-up")
        .send(signUpDto)
        .expect(400);

      expect(response.body.message).toEqual([
        "password must be longer than or equal to 8 characters",
      ]);
    });
  });
});
