import * as request from "supertest";

import { DataSource, Repository } from "typeorm";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import {
  LoginFixture,
  RefreshTokenFixture,
  UserFixture,
} from "../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "./../src/app.module";
import { MockFactory } from "mockingbird";
import { RefreshToken } from "../src/entities";
import { User } from "../src/entities/user.entity";
import { setupTestDataSourceAsync } from "./test-db";

const bcrypt = require("bcrypt");

describe("LoginController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;
  let refreshTokenRepository: Repository<RefreshToken>;

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
    refreshTokenRepository = moduleFixture.get<Repository<RefreshToken>>(
      "RefreshTokenRepository"
    );
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /login", () => {
    it("Should return a token if email credentials are valid", async () => {
      const loginEmailDto = MockFactory(LoginFixture)
        .mutate({
          email: "test@test.com",
          password: "TestPassword1!",
          username: null,
        })
        .one();

      jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(Promise.resolve(MockFactory(UserFixture).one()));

      jest
        .spyOn(refreshTokenRepository, "save")
        .mockResolvedValue(
          Promise.resolve(MockFactory(RefreshTokenFixture).one().withUser())
        );

      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const responseEmail = await request(app.getHttpServer())
        .post("/login")
        .send(loginEmailDto)
        .expect(201);

      expect(responseEmail.body).toHaveProperty("id_token");
      expect(responseEmail.body).toHaveProperty("refresh_token");
    });

    it("should return a token if username credentials are valid", async () => {
      const loginUsernameDto = MockFactory(LoginFixture)
        .mutate({
          username: "testUser",
          password: "TestPassword1!",
          email: null,
        })
        .one();

      jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(Promise.resolve(MockFactory(UserFixture).one()));

      jest
        .spyOn(refreshTokenRepository, "save")
        .mockResolvedValue(
          Promise.resolve(MockFactory(RefreshTokenFixture).one().withUser())
        );

      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const responseUsername = await request(app.getHttpServer())
        .post("/login")
        .send(loginUsernameDto)
        .expect(201);

      expect(responseUsername.body).toHaveProperty("id_token");
      expect(responseUsername.body).toHaveProperty("refresh_token");
    });

    it("should return an error if email is invalid", async () => {
      const loginDto = MockFactory(LoginFixture)
        .mutate({
          email: "invalid@email.com",
          password: "TestPassword1!",
        })
        .one();

      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

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
