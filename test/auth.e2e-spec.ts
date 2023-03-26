import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./../src/app.module";
import { INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { createTestDbAsync } from "./test-db";
import { faker } from "@faker-js/faker";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(await createTestDbAsync())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });

  describe("POST /signup", () => {
    it("should create a new user and return a token", async () => {
      const signUpDto = {
        email: "test@test.com",
        username: "testUser",
        password: "TestPassword1!",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const response = await request(app.getHttpServer())
        .post("/signup")
        .send(signUpDto)
        .expect(201);

      expect(response.body).toHaveProperty("id_token");
    });
    it("should return 400 if email already exists", async () => {
      const signUpDto = {
        email: "test@test.com",
        username: faker.internet.userName(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const response = await request(app.getHttpServer())
        .post("/signup")
        .send(signUpDto)
        .expect(409);

      expect(response.body.message).toEqual("email or username already exists");
    });

    it("should return 400 if username already exists", async () => {
      const signUpDto = {
        email: faker.internet.email(),
        username: "testUser",
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const response = await request(app.getHttpServer())
        .post("/signup")
        .send(signUpDto)
        .expect(409);

      expect(response.body.message).toEqual("email or username already exists");
    });

    it("should return 400 if email is invalid", async () => {
      const signUpDto = {
        email: "invalid_email",
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const response = await request(app.getHttpServer())
        .post("/signup")
        .send(signUpDto)
        .expect(400);

      expect(response.body.message).toEqual("email must be an email");
    });

    it("should return 400 if password is too short", async () => {
      const signUpDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: "TPass",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const response = await request(app.getHttpServer())
        .post("/signup")
        .send(signUpDto)
        .expect(400);

      expect(response.body.message).toEqual(
        "password must be longer than or equal to 8 characters"
      );
    });
  });

  describe("POST /login", () => {
    it("should return a token if user email credentials are valid", async () => {
      const loginEmailDto = { email: "test@test.com", password: "TestPassword1!" };
      const responseEmail = await request(app.getHttpServer())
        .post("/login")
        .send(loginEmailDto)
        .expect(201);

      expect(responseEmail.body).toHaveProperty("id_token");

      const loginUsernameDto = { username: "testUser", password: "TestPassword1!" };
      const responseUsername = await request(app.getHttpServer())
        .post("/login")
        .send(loginUsernameDto)
        .expect(201);

      expect(responseUsername.body).toHaveProperty("id_token");
    });

    it("should return an error if email is invalid", async () => {
      const loginDto = {
        email: "invalid-email",
        password: "TestPassword1!",
      };
      const response = await request(app.getHttpServer())
        .post("/login")
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toEqual("invalid email or password");
    });

    it("should return an error if password is invalid", async () => {
      const loginDto = {
        email: "test@test.com",
        password: "wrong-password",
      };
      const response = await request(app.getHttpServer())
        .post("/login")
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toEqual("invalid email or password");
    });
  });
});
