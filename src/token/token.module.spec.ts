import { RefreshToken, User } from "../entities";

import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { TokenModule } from "./token.module";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("TokenModule", () => {
  let tokenModule: TokenModule;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TokenModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
    })
      .overrideProvider(getRepositoryToken(RefreshToken))
      .useValue({
        findOne: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
      })
      .compile();

    tokenModule = module.get<TokenModule>(TokenModule);
  });

  it("should be defined", () => {
    expect(tokenModule).toBeDefined();
  });
});
