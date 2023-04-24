import * as request from "supertest";

import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "./../src/app.module";
import { DataSource } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { setupTestDataSourceAsync } from "./test-db";
import { MockFactory } from "mockingbird";
import { LoginFixture, SignUpFixture } from "../test/fixtures";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(await setupTestDataSourceAsync())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
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
    });
    it("should return 400 if email already exists", async () => {
      const signUpDto = MockFactory(SignUpFixture)
        .mutate({
          email: "test@test.com",
        })
        .one();

      const response = await request(app.getHttpServer())
        .post("/sign-up")
        .send(signUpDto)
        .expect(409);

      expect(response.body.message).toEqual("Username or email already exists");
    });

    it("should return 400 if username already exists", async () => {
      const signUpDto = MockFactory(SignUpFixture)
        .mutate({
          username: "testUser",
        })
        .one();
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

  describe("POST /login", () => {
    it("should return a token if user email credentials are valid", async () => {
      const loginEmailDto = MockFactory(LoginFixture)
        .mutate({
          email: "test@test.com",
          password: "TestPassword1!",
        })
        .one();
      const responseEmail = await request(app.getHttpServer())
        .post("/login")
        .send(loginEmailDto)
        .expect(201);

      expect(responseEmail.body).toHaveProperty("id_token");

      const loginUsernameDto = {
        username: "testUser",
        password: "TestPassword1!",
      };
      const responseUsername = await request(app.getHttpServer())
        .post("/login")
        .send(loginUsernameDto)
        .expect(201);

      expect(responseUsername.body).toHaveProperty("id_token");
    });

    it("should return an error if email is invalid", async () => {
      const loginDto = MockFactory(LoginFixture)
        .mutate({
          email: "invalid@email.com",
          password: "TestPassword1!",
        })
        .one();
      const response = await request(app.getHttpServer())
        .post("/login")
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials");
    });

    it("should return an error if password is invalid", async () => {
      const loginDto = MockFactory(LoginFixture)
        .mutate({
          email: "test@test.com",
          password: "Wrong-Password",
        })
        .one();

      const response = await request(app.getHttpServer())
        .post("/login")
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials");
    });
  });
});
