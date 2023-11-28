import * as jwt from "jsonwebtoken";

import {
  ConfigFixture,
  RefreshTokenFixture,
  TokensFixture,
  UserFixture,
} from "../../test/fixtures";
import { RefreshToken, User } from "../entities";
import { Test, TestingModule } from "@nestjs/testing";
import { instance, mock } from "ts-mockito";

import { CustomClaim } from "./concrete/custom-claim.type";
import { ICustomClaimsImporter } from "./interfaces/custom-claims-importer.interface";
import { MockFactory } from "mockingbird";
import { Repository } from "typeorm";
import { TokenService } from "./token.service";
import { Tokens } from "../dto";
import { UnauthorizedException } from "@nestjs/common";
import config from "../utils/config";
import { faker } from "@faker-js/faker";

jest.mock("../utils/config", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("jsonwebtoken");

describe("TokenService", () => {
  let tokenService: TokenService;
  let refreshTokenRepository: Repository<RefreshToken>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: "RefreshTokenRepository",
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenService = moduleRef.get<TokenService>(TokenService);
    refreshTokenRepository = moduleRef.get<Repository<RefreshToken>>(
      "RefreshTokenRepository"
    );

    (config as jest.Mock).mockImplementation(() =>
      MockFactory(ConfigFixture).one()
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create token by calling jwt.sign with the correct arguments", async () => {
    const user = MockFactory(UserFixture).one().withRoles() as User;
    const expectedTokens = MockFactory(TokensFixture).one() as Tokens;
    const expectedCustomClaims = {
      user_id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      roles: user.roles.map((userRole) => userRole.role.name),
    };

    (jwt.sign as jest.Mock).mockImplementation(() => expectedTokens.id_token);

    jest.spyOn(refreshTokenRepository, "save").mockResolvedValue({
      refreshToken: expectedTokens.refresh_token,
    } as RefreshToken);

    const tokens = await tokenService.createTokensAsync(
      user,
      config().jwtExpiresIn
    );

    expect(tokens.id_token).toBe(expectedTokens.id_token);
    expect(tokens.refresh_token).toBe(expectedTokens.refresh_token);
    expect(jwt.sign).toHaveBeenCalledWith(
      expectedCustomClaims,
      config().jwtSecret,
      {
        algorithm: config().jwtAlgorithm,
        audience: config().jwtAudience,
        issuer: config().jwtIssuer,
        expiresIn: config().jwtExpiresIn,
      }
    );
  });

  it("should create token by calling jwt.sign with the correct arguments(Not Role)", async () => {
    const user = MockFactory(UserFixture).one() as User;
    const expectedTokens = MockFactory(TokensFixture).one() as Tokens;
    const expectedCustomClaims = {
      user_id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
    };

    (jwt.sign as jest.Mock).mockImplementation(() => expectedTokens.id_token);

    jest.spyOn(refreshTokenRepository, "save").mockResolvedValue({
      refreshToken: expectedTokens.refresh_token,
    } as RefreshToken);

    const tokens = await tokenService.createTokensAsync(
      user,
      config().jwtExpiresIn
    );

    expect(tokens.id_token).toBe(expectedTokens.id_token);
    expect(tokens.refresh_token).toBe(expectedTokens.refresh_token);
    expect(jwt.sign).toHaveBeenCalledWith(
      expectedCustomClaims,
      config().jwtSecret,
      {
        algorithm: config().jwtAlgorithm,
        audience: config().jwtAudience,
        issuer: config().jwtIssuer,
        expiresIn: config().jwtExpiresIn,
      }
    );
  });

  it("should add custom claims to the TokenService instance", () => {
    const expectedCustomClaims = {
      claim1: "test",
      claim2: { objKey1: "test", objKey2: "test" },
    };
    tokenService.addCustomClaim(new CustomClaim("claim1", "test"));
    tokenService.addCustomClaim(new CustomClaim("claim2", { objKey1: "test" }));
    tokenService.addCustomClaim(new CustomClaim("claim2", { objKey2: "test" }));

    expect(tokenService["customClaims"]).toEqual(expectedCustomClaims);
  });

  it("should add custom claim importer", () => {
    const mockedCustomClaimImporter: ICustomClaimsImporter =
      mock<ICustomClaimsImporter>();
    const fakeCustomClaimImporter = instance(mockedCustomClaimImporter);

    tokenService.addCustomClaimImporter(fakeCustomClaimImporter);

    expect(tokenService["customClaimImporters"]).toContain(
      fakeCustomClaimImporter
    );
  });

  it("should create new token", async () => {
    const refreshTokenEntity = MockFactory(RefreshTokenFixture)
      .one()
      .withUser();

    const expectedToken = faker.random.alphaNumeric(64);
    (jwt.sign as jest.Mock).mockImplementation(() => expectedToken);

    const getRefreshTokenByTokenAsyncMock = jest.spyOn(
      tokenService as any,
      "getValidRefreshTokenAsync"
    );
    getRefreshTokenByTokenAsyncMock.mockResolvedValue(refreshTokenEntity);

    const token = await tokenService.refreshTokenAsync(
      refreshTokenEntity.refreshToken
    );
    expect(token).toBe(expectedToken);
  });

  it("should create new token", async () => {
    const refreshTokenEntity = MockFactory(RefreshTokenFixture)
      .one()
      .withUser();

    const expectedToken = faker.random.alphaNumeric(64);
    (jwt.sign as jest.Mock).mockImplementation(() => expectedToken);

    jest
      .spyOn(refreshTokenRepository, "findOne")
      .mockResolvedValue(refreshTokenEntity);

    const token = await tokenService.refreshTokenAsync(
      refreshTokenEntity.refreshToken
    );
    expect(token).toBe(expectedToken);
  });

  it("should throw unauthorized excepiton", async () => {
    const token = "testToken";

    jest.spyOn(refreshTokenRepository, "findOne").mockResolvedValue(null);

    await expect(() => tokenService.refreshTokenAsync(token)).rejects.toThrow(
      UnauthorizedException
    );
  });
});
