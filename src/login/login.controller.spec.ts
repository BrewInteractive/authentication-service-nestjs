import { LoginFixture, UserFixture } from "../../test/fixtures";
import { User, UserResetPasswordRequest, UserRole } from "../entities";

import { LoginController } from "./login.controller";
import { AutomapperModule } from "@automapper/nestjs";
import { LoginProfile } from "./mapping-profiles/login.profile";
import { MockFactory } from "mockingbird";
import { Test } from "@nestjs/testing";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { UnauthorizedException } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { classes } from "@automapper/classes";
import { faker } from "@faker-js/faker";
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
      .compile();

    loginController = moduleRef.get<LoginController>(LoginController);
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
      .spyOn(tokenService, "createTokenAsync")
      .mockReturnValueOnce(Promise.resolve(token));

    await expect(loginController.loginAsync(loginDto)).resolves.toEqual({
      id_token: token,
    });
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
