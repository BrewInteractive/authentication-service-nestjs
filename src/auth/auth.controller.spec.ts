import { AuthController } from "./auth.controller";
import { Test } from "@nestjs/testing";
import { TokenService } from "../token/token.service";
import { UserService } from "../user/user.service";
import { faker } from "@faker-js/faker";
import { SignUpProfile } from "./mapping-profiles/sign-up.profile";
import { LoginProfile } from "./mapping-profiles/login.profile";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { UserModule } from "../user/user.module";
import { TokenModule } from "../token/token.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../models/user.entity";

describe("AuthController", () => {
  let authController: AuthController;
  let tokenService: TokenService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        UserModule,
        TokenModule,
      ],
      controllers: [AuthController],
      providers: [SignUpProfile, LoginProfile],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .compile();

    authController = moduleRef.get<AuthController>(AuthController);
    tokenService = moduleRef.get<TokenService>("TokenService");
    userService = moduleRef.get<UserService>("UserService");
  });

  it("should return a token if the email and password are valid", async () => {
    const loginDto = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: "TestPassword",
    };
    const user = {
      id: "1",
      email: loginDto.email,
      passwordHash:
        "$2b$10$u1E.BPg.ZglghX.wo79r0OFn97022aLCYaQMMlR0hAnaqeus5r9PG",
    };

    const token = faker.random.alphaNumeric(32);
    jest
      .spyOn(userService, "getUserAsync")
      .mockReturnValueOnce(Promise.resolve(user as User));

    jest.spyOn(tokenService, "addCustomClaims").mockReturnValueOnce();

    jest
      .spyOn(tokenService, "createToken")
      .mockReturnValueOnce(Promise.resolve(token));

    await expect(authController.login(loginDto)).resolves.toEqual({
      id_token: token,
    });
  });

  it("should return a token if the sign-up process is successful", async () => {
    const fakerPassword = "TestPassword";
    const signUpDto = {
      username: faker.internet.userName(),
      lastName: faker.name.lastName(),
      firstName: faker.name.firstName(),
      password: fakerPassword,
      email: faker.internet.email(),
      passwordHash:
        "$2b$10$u1E.BPg.ZglghX.wo79r0OFn97022aLCYaQMMlR0hAnaqeus5r9PG",
    };
    const token = faker.random.alphaNumeric(32);

    jest
      .spyOn(userService, "getUserAsync")
      .mockReturnValueOnce(null);

    jest.spyOn(tokenService, "addCustomClaims").mockReturnValueOnce();

    jest
      .spyOn(tokenService, "createToken")
      .mockReturnValueOnce(Promise.resolve(token));

    await expect(authController.signUp(signUpDto)).resolves.toEqual({
      id_token: token,
    });
  });
});
