import { RefreshToken, User, UserRole } from "../entities";
import { Test, TestingModule } from "@nestjs/testing";

import { ConfigModule } from "@nestjs/config";
import { InvalidRefreshTokenError } from "../error";
import { MockFactory } from "mockingbird";
import { RefreshTokenController } from "./refresh-token.controller";
import { RefreshTokenRequest } from "./dto/refresh-token-request.dto";
import { RefreshTokenResponse } from "./dto";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { Tokens } from "../dto";
import { TokensFixture } from "../../test/fixtures";
import { UnauthorizedException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("RefreshTokenController", () => {
  let controller: RefreshTokenController;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefreshTokenController],
      imports: [
        TokenModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
    })
      .overrideProvider(getRepositoryToken(UserRole))
      .useValue({
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(RefreshToken))
      .useValue({
        findOne: jest.fn(),
        update: jest.fn(),
      })
      .compile();

    controller = module.get<RefreshTokenController>(RefreshTokenController);
    tokenService = module.get<TokenService>("TokenService");
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create new tokens using a refresh token.", async () => {
    const refreshTokenRequest: RefreshTokenRequest = {
      refreshToken: "mockRefreshToken",
    };

    const expectedResult = MockFactory(TokensFixture).one() as Tokens;

    jest
      .spyOn(tokenService, "refreshTokensAsync")
      .mockResolvedValue(expectedResult);

    const actualResult = await controller.refreshTokens(refreshTokenRequest);

    expect(actualResult).toStrictEqual(expectedResult as RefreshTokenResponse);
  });

  it("should throw UnauthorizedException if the refresh token is invalid", async () => {
    const refreshTokenRequest: RefreshTokenRequest = {
      refreshToken: "invalidMockRefreshToken",
    };

    jest
      .spyOn(tokenService, "refreshTokensAsync")
      .mockImplementationOnce(() => {
        throw new InvalidRefreshTokenError();
      });

    await expect(controller.refreshTokens(refreshTokenRequest)).rejects.toThrow(
      UnauthorizedException
    );
  });
});
