import * as jwt from "jsonwebtoken";

import { RefreshToken, User } from "../entities";
import {
  RefreshTokenFixture,
  TokensFixture,
  UserFixture,
} from "../../test/fixtures";
import { Test, TestingModule } from "@nestjs/testing";
import { instance, mock } from "ts-mockito";

import { ConfigService } from "@nestjs/config";
import { ICustomClaimsImporter } from "./interfaces/custom-claims-importer.interface";
import { InvalidRefreshTokenError } from "../error";
import { MockFactory } from "mockingbird";
import { Repository } from "typeorm";
import { TokenService } from "./token.service";
import { Tokens } from "../dto";
import { UserCustomClaimsImporter } from "./concrete/user-custom-claims-importer.type";

jest.mock("jsonwebtoken");

describe("TokenService", () => {
  let tokenService: TokenService;
  let refreshTokenRepository: Repository<RefreshToken>;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case "jwt.secret":
                  return "testSecret";
                case "jwt.algorithm":
                  return "testSecret";
                case "jwt.expiresIn":
                  return 3600;
                case "jwt.audience":
                  return "testAudience";
                case "jwt.issuer":
                  return "testIssuer";
                default:
                  return undefined;
              }
            }),
          },
        },
        {
          provide: "RefreshTokenRepository",
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenService = moduleRef.get<TokenService>(TokenService);
    refreshTokenRepository = moduleRef.get<Repository<RefreshToken>>(
      "RefreshTokenRepository"
    );
    configService = moduleRef.get<ConfigService>(ConfigService);
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

    (jwt.sign as jest.Mock).mockImplementation(() => expectedTokens.idToken);

    jest.spyOn(refreshTokenRepository, "save").mockResolvedValue({
      refreshToken: expectedTokens.refreshToken,
    } as RefreshToken);

    const tokens = await tokenService.createTokensAsync(
      user,
      configService.get("jwt.expiresIn")
    );

    expect(tokens.idToken).toBe(expectedTokens.idToken);
    expect(tokens.refreshToken).toBe(expectedTokens.refreshToken);
    expect(jwt.sign).toHaveBeenCalledWith(
      expectedCustomClaims,
      configService.get("jwt.secret"),
      {
        algorithm: configService.get("jwt.algorithm"),
        audience: configService.get("jwt.audience"),
        issuer: configService.get("jwt.issuer"),
        expiresIn: configService.get("jwt.expiresIn"),
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

    (jwt.sign as jest.Mock).mockImplementation(() => expectedTokens.idToken);

    jest.spyOn(refreshTokenRepository, "save").mockResolvedValue({
      refreshToken: expectedTokens.refreshToken,
    } as RefreshToken);

    const tokens = await tokenService.createTokensAsync(
      user,
      configService.get("jwt.expiresIn")
    );

    expect(tokens.idToken).toBe(expectedTokens.idToken);
    expect(tokens.refreshToken).toBe(expectedTokens.refreshToken);
    expect(jwt.sign).toHaveBeenCalledWith(
      expectedCustomClaims,
      configService.get("jwt.secret"),
      {
        algorithm: configService.get("jwt.algorithm"),
        audience: configService.get("jwt.audience"),
        issuer: configService.get("jwt.issuer"),
        expiresIn: configService.get("jwt.expiresIn"),
      }
    );
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

  it("should create new refresh token", async () => {
    const refreshTokenEntity = MockFactory(RefreshTokenFixture)
      .one()
      .withUser();
    const expectedTokens = MockFactory(TokensFixture).one() as Tokens;

    jest.spyOn(refreshTokenRepository, "save").mockResolvedValue({
      refreshToken: expectedTokens.refreshToken,
    } as RefreshToken);

    (jwt.sign as jest.Mock).mockImplementation(() => expectedTokens.idToken);

    jest
      .spyOn(refreshTokenRepository, "findOne")
      .mockResolvedValue(refreshTokenEntity);

    jest.spyOn(refreshTokenRepository, "update").mockResolvedValueOnce(null);

    const tokens = await tokenService.refreshTokensAsync(
      refreshTokenEntity.refreshToken
    );
    expect(tokens.idToken).toBe(expectedTokens.idToken);
    expect(tokens.refreshToken).toBe(expectedTokens.refreshToken);
  });

  it("should throw InvalidRefreshTokenError when the refresh token is invalid", async () => {
    const token = "testToken";

    jest.spyOn(refreshTokenRepository, "findOne").mockResolvedValue(null);

    await expect(() => tokenService.refreshTokensAsync(token)).rejects.toThrow(
      InvalidRefreshTokenError
    );
  });

  it("importer should only have one", async () => {
    const user = MockFactory(UserFixture).one() as User;
    const expectedTokens = MockFactory(TokensFixture).one() as Tokens;

    (jwt.sign as jest.Mock).mockImplementation(() => expectedTokens.idToken);

    jest.spyOn(refreshTokenRepository, "save").mockResolvedValue({
      refreshToken: expectedTokens.refreshToken,
    } as RefreshToken);

    await tokenService.createTokensAsync(
      user,
      configService.get("jwt.expiresIn")
    );
    await tokenService.createTokensAsync(
      user,
      configService.get("jwt.expiresIn")
    );

    expect(tokenService["customClaimImporters"]).toEqual([
      new UserCustomClaimsImporter(),
    ]);
  });
});
