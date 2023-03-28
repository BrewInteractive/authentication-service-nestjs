import * as jwt from "jsonwebtoken";

import { Test, TestingModule } from "@nestjs/testing";

import { TokenService } from "./token.service";
import { faker } from "@faker-js/faker";

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
    const id = faker.random.numeric();
    const email = faker.internet.email();
    const username = faker.internet.userName();
    const expiresIn = 3600;
    const expectedToken = "fakeToken";
    const expectedCustomClaims = {
      user_id: id,
      email: email,
      username: username,
    };
    const expectedJwtSecret = "testSecret";
    const expectedJwtAlgorithm = "HS256";
    const expectedJwtAudience = "testAudience";
    const expectedJwtSubject = "testSubject";
    const expectedJwtIssuer = "testIssuer";

    process.env.JWT_SECRET = expectedJwtSecret;
    process.env.JWT_ALGORITHM = expectedJwtAlgorithm;
    process.env.JWT_AUDIENCE = expectedJwtAudience;
    process.env.JWT_SUBJECT = expectedJwtSubject;
    process.env.JWT_ISSUER = expectedJwtIssuer;

    const user = {
      id: id,
      email: email,
      username: username,
    };
    const token = await tokenService.createToken(user, expiresIn);

    expect(token).toBe(expectedToken);
    expect(jwt.sign).toHaveBeenCalledWith(
      expectedCustomClaims,
      expectedJwtSecret,
      {
        algorithm: expectedJwtAlgorithm,
        audience: expectedJwtAudience,
        subject: expectedJwtSubject,
        issuer: expectedJwtIssuer,
        expiresIn,
      }
    );
  });

  it("should add custom claims to the TokenService instance", () => {
    const expectedCustomClaims = {
      claim1: "test",
      claim2: { objKey: "test2" },
    };
    tokenService.addCustomClaims("claim1", "test");
    tokenService.addCustomClaims("claim2", { objKey: "test2" });

    expect(tokenService["customClaims"]).toEqual(expectedCustomClaims);
  });
});
