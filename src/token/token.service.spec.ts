import * as jwt from "jsonwebtoken";

import { Test, TestingModule } from "@nestjs/testing";
import { instance, mock } from "ts-mockito";

import { CustomClaim } from "./concrete/custom-claim.type";
import { ICustomClaimsImporter } from "./interfaces/custom-claims-importer.interface";
import { MockFactory } from "mockingbird";
import { TokenService } from "./token.service";
import { User } from "../entities/user.entity";
import { UserFixture } from "../../test/fixtures";
import config from "../utils/config";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fakeToken"),
}));

describe("TokenService", () => {
  let tokenService: TokenService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
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
});
