import * as jwt from "jsonwebtoken";

import { Test, TestingModule } from "@nestjs/testing";
import { instance, mock } from "ts-mockito";

import { CustomClaim } from "./concrete/custom-claim.type";
import { ICustomClaimsImporter } from "./interfaces/custom-claims-importer.interface";
import { MockFactory } from "mockingbird";
import { TokenService } from "./token.service";
import { User, RefreshToken } from "../entities";
import { UserFixture, RefreshTokenFixture } from "../../test/fixtures";
import config from "../utils/config";
import { Repository } from "typeorm";
import { rejects } from "assert";
import { UnauthorizedException } from "@nestjs/common";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fakeToken"),
}));

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
        }
      ],
      
    }).compile();

    tokenService = moduleRef.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create token by calling jwt.sign with the correct arguments", async () => {
    const user = MockFactory(UserFixture).one().withRoles() as User;
    const expectedToken = "fakeToken";
    const expectedCustomClaims = {
      user_id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      roles: user.roles.map((userRole) => userRole.role.name),
    };
    const expectedJwtSecret = "testSecret";
    const expectedJwtAlgorithm = "HS256";
    const expectedJwtAudience = "testAudience";
    const expectedJwtSubject = expectedCustomClaims.user_id;
    const expectedJwtIssuer = "testIssuer";

    process.env.JWT_SECRET = expectedJwtSecret;
    process.env.JWT_ALGORITHM = expectedJwtAlgorithm;
    process.env.JWT_AUDIENCE = expectedJwtAudience;
    process.env.JWT_SUBJECT = expectedJwtSubject;
    process.env.JWT_ISSUER = expectedJwtIssuer;

    const token = await tokenService.createTokenAsync(user);

    expect(token).toBe(expectedToken);
    expect(jwt.sign).toHaveBeenCalledWith(
      expectedCustomClaims,
      expectedJwtSecret,
      {
        algorithm: expectedJwtAlgorithm,
        audience: expectedJwtAudience,
        issuer: expectedJwtIssuer,
        expiresIn: config().jwtExpiresIn,
      }
    );
  });

  it("should create token by calling jwt.sign with the correct arguments(Not Role)", async () => {
    const user = MockFactory(UserFixture).one() as User;
    const expiresIn = 3600;
    const expectedToken = "fakeToken";
    const expectedCustomClaims = {
      user_id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
    };
    const expectedJwtSecret = "testSecret";
    const expectedJwtAlgorithm = "HS256";
    const expectedJwtAudience = "testAudience";
    const expectedJwtSubject = expectedCustomClaims.user_id;
    const expectedJwtIssuer = "testIssuer";

    process.env.JWT_SECRET = expectedJwtSecret;
    process.env.JWT_ALGORITHM = expectedJwtAlgorithm;
    process.env.JWT_AUDIENCE = expectedJwtAudience;
    process.env.JWT_SUBJECT = expectedJwtSubject;
    process.env.JWT_ISSUER = expectedJwtIssuer;

    const token = await tokenService.createTokenAsync(user, expiresIn);

    expect(token).toBe(expectedToken);
    expect(jwt.sign).toHaveBeenCalledWith(
      expectedCustomClaims,
      expectedJwtSecret,
      {
        algorithm: expectedJwtAlgorithm,
        audience: expectedJwtAudience,
        issuer: expectedJwtIssuer,
        expiresIn,
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
    const refreshTokenEntity = MockFactory(RefreshTokenFixture).one().withUser();
    const expectedToken = "fakeToken";

    const getRefreshTokenByTokenAsyncMock = jest.spyOn(tokenService as any, "getRefreshTokenByTokenAsync");
    getRefreshTokenByTokenAsyncMock.mockResolvedValue(refreshTokenEntity);
    
    const token  = await tokenService.createRefreshTokenAsync(refreshTokenEntity.refreshToken);
    expect(token).toBe(expectedToken);
  });

  it("should create new token", async () => {
    const refreshTokenEntity = MockFactory(RefreshTokenFixture).one().withUser();
    const expectedToken = "fakeToken";

    const getRefreshTokenByTokenAsyncMock = jest.spyOn(tokenService as any, "getRefreshTokenByTokenAsync");
    getRefreshTokenByTokenAsyncMock.mockResolvedValue(refreshTokenEntity);
    
    const token  = await tokenService.createRefreshTokenAsync(refreshTokenEntity.refreshToken);
    expect(token).toBe(expectedToken);
  });

  it("should throw unauthorized excepiton", async () => {
    const token = "testToken";
    const getRefreshTokenByTokenAsyncMock = jest.spyOn(tokenService as any, "getRefreshTokenByTokenAsync");
    
    getRefreshTokenByTokenAsyncMock.mockResolvedValue(null);
    
    await expect(() => tokenService.createRefreshTokenAsync(token)).rejects.toThrow(
      UnauthorizedException
    ); 
  });
});
