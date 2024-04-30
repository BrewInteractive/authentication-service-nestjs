import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { LoginRequestFixture, UserFixture } from "../fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../../src/app.module";
import { MockFactory } from "mockingbird";
import { User } from "../../src/entities/user.entity";
import { setupTestDataSourceAsync } from "../test-db";

describe("LoginController (e2e)", () => {
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
    await app.init();
    userRepository = moduleFixture.get<Repository<User>>("UserRepository");
  });

  afterEach(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /login", () => {
    it("Should return a token if email credentials are valid", async () => {
      let user = MockFactory(UserFixture).one().hashPassword();
      await userRepository.save(user);

      const loginEmailRequestDto = MockFactory(LoginRequestFixture)
        .mutate({
          email: user.email,
          password: user.password,
        })
        .one();
      loginEmailRequestDto.username = null;

      const responseEmail = await request(app.getHttpServer())
        .post("/login")
        .send(loginEmailRequestDto)
        .expect(201);

      expect(responseEmail.body).toHaveProperty("id_token");
      expect(responseEmail.body).toHaveProperty("refresh_token");
    });

    it("should return a token if username credentials are valid", async () => {
      let user = MockFactory(UserFixture).one().hashPassword();
      await userRepository.save(user);

      const loginUsernameRequestDto = MockFactory(LoginRequestFixture)
        .mutate({
          username: user.username,
          password: user.password,
        })
        .one();
      loginUsernameRequestDto.email = null;
      const responseUsername = await request(app.getHttpServer())
        .post("/login")
        .send(loginUsernameRequestDto)
        .expect(201);

      expect(responseUsername.body).toHaveProperty("id_token");
      expect(responseUsername.body).toHaveProperty("refresh_token");
    });

    it("should return an error if email is invalid", async () => {
      let user = MockFactory(UserFixture).one().hashPassword();
      await userRepository.save(user);

      const loginRequestDto = MockFactory(LoginRequestFixture)
        .mutate({
          email: "invalid@email.com",
          password: user.password,
        })
        .one();
      loginRequestDto.username = null;

      const response = await request(app.getHttpServer())
        .post("/login")
        .send(loginRequestDto)
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials");
    });

    it("should return an error if password is invalid", async () => {
      let user = MockFactory(UserFixture).one().hashPassword();
      await userRepository.save(user);

      const loginRequestDto = MockFactory(LoginRequestFixture)
        .mutate({
          email: user.email,
          password: "Wrong-Password",
        })
        .one();
      loginRequestDto.username = null;

      const response = await request(app.getHttpServer())
        .post("/login")
        .send(loginRequestDto)
        .expect(401);

      expect(response.body.message).toEqual("Invalid credentials");
    });
  });
});
