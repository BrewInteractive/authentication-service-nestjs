import { Test, TestingModule } from "@nestjs/testing";
import { TokenService } from "./token.service";
import * as jwt from "jsonwebtoken";

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

  describe("createToken", () => {
    it("should call jwt.sign with the correct arguments", () => {
      const expiresIn = 3600;
      const expectedToken = "fakeToken";
      const expectedCustomClaims = {};
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

      const token = tokenService.createToken(expiresIn);

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
  });

  describe("addCustomClaims", () => {
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
});
