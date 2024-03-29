import { RefreshToken, User, UserRole } from "../entities";
import { Test, TestingModule } from "@nestjs/testing";

import { MockFactory } from "mockingbird";
import { RefreshTokenController } from "./refresh-token.controller";
import { RefreshTokenRequest } from "./dto/refresh-token-request.dto";
import { RefreshTokenResponse } from "./dto/refresh-token-response.dto";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { Tokens } from "../dto";
import { TokensFixture } from "../../test/fixtures";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

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

  it("Should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("Should return a refresh token.", async () => {
    const expectedTokens = MockFactory(TokensFixture).one() as Tokens;
    const refreshTokenRequest: RefreshTokenRequest = {
      refreshToken: "mockRefreshToken",
    };

    jest
      .spyOn(tokenService, "refreshTokenAsync")
      .mockResolvedValue(expectedTokens);

    const result = await controller.createRefreshToken(refreshTokenRequest);

    expect(result).toEqual({
      id_token: expectedTokens.id_token,
      refresh_token: expectedTokens.refresh_token,
    } as RefreshTokenResponse);
  });
});
