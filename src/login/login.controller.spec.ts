import { LoginFixture, TokensFixture, UserFixture } from "../../test/fixtures";
import {
  RefreshToken,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "../entities";

import { AutomapperModule } from "@automapper/nestjs";
import { LoginController } from "./login.controller";
import { LoginProfile } from "./mapping-profiles/login.profile";
import { MockFactory } from "mockingbird";
import { Test } from "@nestjs/testing";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { Tokens } from "../models";
import { UnauthorizedException } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("LoginController", () => {
  let loginController: LoginController;
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
      controllers: [LoginController],
      providers: [LoginProfile],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(UserRole))
      .useValue({
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(UserResetPasswordRequest))
      .useValue({
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(RefreshToken))
      .useValue({
        save: jest.fn(),
        findOne: jest.fn(),
      })
      .compile();

    loginController = moduleRef.get<LoginController>(LoginController);
    tokenService = moduleRef.get<TokenService>("TokenService");
    userService = moduleRef.get<UserService>("UserService");
  });

  it("should return a token if the email and password are valid", async () => {
    const loginDto = MockFactory(LoginFixture).one();
    const user = MockFactory(UserFixture).one();
    delete loginDto.username;

    const tokens = MockFactory(TokensFixture).one() as Tokens;

    jest
      .spyOn(userService, "validateUserAsync")
      .mockReturnValueOnce(Promise.resolve(user as User));

    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockReturnValueOnce(Promise.resolve(tokens));

    await expect(loginController.loginAsync(loginDto)).resolves.toEqual(tokens);
  });

  it("should return a token if the username and password are valid", async () => {
    const loginDto = MockFactory(LoginFixture).one();
    const user = MockFactory(UserFixture).one();
    delete loginDto.email;

    const tokens = MockFactory(TokensFixture).one() as Tokens;

    jest
      .spyOn(userService, "validateUserAsync")
      .mockReturnValueOnce(Promise.resolve(user as User));

    jest
      .spyOn(tokenService, "createTokensAsync")
      .mockReturnValueOnce(Promise.resolve(tokens));

    await expect(loginController.loginAsync(loginDto)).resolves.toEqual(tokens);
  });

  it("should return a token if the email and password are invalid", async () => {
    const loginDto = MockFactory(LoginFixture).one();

    const expectedResult = new UnauthorizedException("Invalid credentials");
    jest
      .spyOn(userService, "validateUserAsync")
      .mockRejectedValueOnce(expectedResult);

    await expect(loginController.loginAsync(loginDto)).rejects.toThrow(
      expectedResult
    );
  });
});
