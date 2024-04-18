import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { SignUpFixture, UserFixture } from "../fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { MockFactory } from "mockingbird";
import { User } from "../../src/entities/user.entity";
import { faker } from "@faker-js/faker";
import { setupTestDataSourceAsync } from "../test-db";

describe("SignUpController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;

  const validPassword = "Password1@";

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
  });

  afterEach(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /sign-up", () => {
    it("should create a new user and return a token", async () => {
      const signUpDto = MockFactory(SignUpFixture)
        .mutate({
          email: faker.internet.email(),
          username: faker.internet.userName(),
          password: validPassword,
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
      let user = MockFactory(UserFixture).one();
      await userRepository.save(user);

      const signUpDto = MockFactory(SignUpFixture)
        .mutate({
          email: user.email,
          password: validPassword,
        })
        .one();

      const response = await request(app.getHttpServer())
        .post("/sign-up")
        .send(signUpDto)
        .expect(409);

      expect(response.body.message).toEqual("Username or email already exists");
    });

    it("should return 409 if username already exists", async () => {
      let user = MockFactory(UserFixture).one();
      await userRepository.save(user);

      const signUpDto = MockFactory(SignUpFixture)
        .mutate({
          username: user.username,
          password: validPassword,
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
          email: "invalid_email",
          password: validPassword,
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
          password: "asd",
        })
        .one();
      const response = await request(app.getHttpServer())
        .post("/sign-up")
        .send(signUpDto)
        .expect(400);

      expect(response.body.message).toEqual(["password is too weak"]);
    });

    it("should return 400 if password is too weak", async () => {
      const signUpDto = MockFactory(SignUpFixture)
        .mutate({
          password: "weakpassword",
        })
        .one();
      const response = await request(app.getHttpServer())
        .post("/sign-up")
        .send(signUpDto)
        .expect(400);

      expect(response.body.message).toEqual(["password is too weak"]);
    });
  });
});
