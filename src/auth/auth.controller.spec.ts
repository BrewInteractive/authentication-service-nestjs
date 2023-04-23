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
import { MockFactory } from "mockingbird";
import { UserFixture, LoginFixture, SignUpFixture } from "../../test/fixtures";
import { UnauthorizedException } from "@nestjs/common";

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
    const loginDto = MockFactory(LoginFixture).one();
    const user = MockFactory(UserFixture).one();

    const token = faker.random.alphaNumeric(32);
    jest
      .spyOn(userService, "validateUserAsync")
      .mockReturnValueOnce(Promise.resolve(user as User));

    jest
      .spyOn(tokenService, "createToken")
      .mockReturnValueOnce(Promise.resolve(token));

    await expect(authController.loginAsync(loginDto)).resolves.toEqual({
      id_token: token,
    });
  });

  it("should return a token if the email and password are invalid", async () => {
    const loginDto = MockFactory(LoginFixture).one();

    const expectedResult = new UnauthorizedException("Invalid credentials");
    jest
      .spyOn(userService, "validateUserAsync")
      .mockRejectedValueOnce(expectedResult);

    await expect(authController.loginAsync(loginDto)).rejects.toThrow(
      expectedResult
    );
  });

  it("should return a token if the sign-up process is successful", async () => {
    const signUpDto = MockFactory(SignUpFixture).one();
    const user = MockFactory(UserFixture).one() as User;
    const token = faker.random.alphaNumeric(32);

    jest
      .spyOn(userService, "createUserAsync")
      .mockReturnValueOnce(Promise.resolve(user));

    jest
      .spyOn(tokenService, "createToken")
      .mockReturnValueOnce(Promise.resolve(token));

    await expect(authController.signUpAsync(signUpDto)).resolves.toEqual({
      id_token: token,
    });
  });
});
