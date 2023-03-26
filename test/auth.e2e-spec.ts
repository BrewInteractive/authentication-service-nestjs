import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./../src/app.module";
import { INestApplication } from "@nestjs/common";
import { DataSource, getMetadataArgsStorage } from "typeorm";
import { createTestDbAsync } from "./test-db";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

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
        email: faker.internet.email(),
        usernam: faker.internet.userName(),
        password: faker.internet.password(),
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
        .expect(400);

      expect(response.body.message).toEqual("Email or username already exists");
    });

    it("should return 400 if username already exists", async () => {
      const signUpDto = {
        email: faker.internet.email(),
        username: "testuser",
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const response = await request(app.getHttpServer())
        .post("/signup")
        .send(signUpDto)
        .expect(400);

      expect(response.body.message).toEqual("Email or username already exists");
    });

    it("should return 400 if email is invalid", async () => {
      const signUpDto = {
        email: "invalid_email",
        username: faker.internet.userName(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const response = await request(app.getHttpServer())
        .post("/signup")
        .send(signUpDto)
        .expect(400);

      expect(response.body.message).toEqual("Email must be an email");
    });

    it("should return 400 if password is too short", async () => {
      const signUpDto = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: "1234",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const response = await request(app.getHttpServer())
        .post("/signup")
        .send(signUpDto)
        .expect(400);

      expect(response.body.message).toEqual(
        "Password must be at least 8 characters long"
      );
    });
  });

  describe("POST /login", () => {
    it("should return a token if user credentials are valid", async () => {
      // create a user with known credentials
      const password = faker.internet.password();
      const user = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        passwordHash: await bcrypt.hash(password, 10),
      };
      await app.getHttpServer().post("/signup").send(user).expect(201);

      // log in with the known credentials
      const loginDto = { email: user.email, password: password };
      const response = await request(app.getHttpServer())
        .post("/login")
        .send(loginDto)
        .expect(201);

      expect(response.body).toHaveProperty("id_token");
    });

    it("should return an error if email is invalid", async () => {
      const loginDto = {
        email: "invalid-email",
        password: faker.internet.password(),
      };
      const response = await request(app.getHttpServer())
        .post("/login")
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toEqual("Invalid email or password");
    });

    it("should return an error if password is invalid", async () => {
      const loginDto = {
        email: faker.internet.email(),
        password: "wrong-password",
      };
      const response = await request(app.getHttpServer())
        .post("/login")
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toEqual("Invalid email or password");
    });
  });
});
