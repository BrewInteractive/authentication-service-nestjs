import { Test } from "@nestjs/testing";
import { TokenModule } from "./token.module";
import { TokenService } from "./token.service";

describe("TokenModule", () => {
  let tokenService: TokenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TokenModule],
    }).compile();

    tokenService = module.get<TokenService>("TokenService");
  });

  it("should be defined", () => {
    expect(tokenService).toBeDefined();
  });
});