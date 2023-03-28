import { Test } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { TokenService } from "../token/token.service";
import { UserService } from "../user/user.service";
import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

describe("AuthController", () => {
  let authController: AuthController;
  let tokenService: TokenService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: "TokenService",
          useValue: {
            addCustomClaims: jest.fn(),
            createToken: jest.fn(),
          },
        },
        {
          provide: "UserService",
          useValue: {
            validateUser: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    tokenService = moduleRef.get<TokenService>("TokenService");
    userService = moduleRef.get<UserService>("UserService");
  });

  it("should return a token if the email and password are valid", async () => {
    const loginDto = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const user = {
      id: "1",
      email: loginDto.email,
      passwordHash: await bcrypt.hash(loginDto.password, 10),
    };
    userService.getUser = jest.fn().mockResolvedValue(user);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    tokenService.addCustomClaims = jest.fn();
    tokenService.createToken = jest.fn().mockResolvedValue("token");

    await expect(authController.login(loginDto)).resolves.toEqual({
      id_token: "token",
    });
  });

  it("should return a token if the sign-up process is successful", async () => {
    const fakerPassword = faker.internet.password();
    const signUpDto = {
      username: faker.internet.userName(),
      lastName: faker.name.lastName(),
      firstName: faker.name.firstName(),
      password: fakerPassword,
      email: faker.internet.email(),
      passwordHash: await bcrypt.hash(fakerPassword, 10),
    };
    const user = { id: "1" };
    userService.createUser = jest.fn().mockResolvedValue(user);
    tokenService.addCustomClaims = jest.fn();
    tokenService.createToken = jest.fn().mockResolvedValue("token");

    await expect(authController.signUp(signUpDto)).resolves.toEqual({
      id_token: "token",
    });
  });
});
