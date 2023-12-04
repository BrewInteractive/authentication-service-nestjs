import { RefreshToken, User, UserRole } from "../entities";
import { Test, TestingModule } from "@nestjs/testing";

import { RefreshTokenController } from "./refresh-token.controller";
import { RefreshTokenRequest } from "./dto/refresh-token-request.dto";
import { RefreshTokenResponse } from "./dto/refresh-token-response.dto";
import { TokenModule } from "../token/token.module";
import { TokenService } from "../token/token.service";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("RefreshTokenController", () => {
  let controller: RefreshTokenController;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefreshTokenController],
      imports: [TokenModule],
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
      })
      .compile();

    controller = module.get<RefreshTokenController>(RefreshTokenController);
    tokenService = module.get<TokenService>("TokenService");
  });

  it("Should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("Should return a refresh token.", async () => {
    const mockIdToken = "mockIdToken";
    const refreshTokenRequest: RefreshTokenRequest = {
      refreshToken: "mockRefreshToken",
    };

    jest
      .spyOn(tokenService, "refreshTokenAsync")
      .mockResolvedValue(mockIdToken);

    const result = await controller.createRefreshToken(refreshTokenRequest);

    expect(result).toEqual({
      id_token: mockIdToken,
      refresh_token: refreshTokenRequest.refreshToken,
    } as RefreshTokenResponse);
  });
});
