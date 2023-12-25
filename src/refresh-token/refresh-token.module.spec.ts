import { RefreshToken, User, UserRole } from "../entities";

import { RefreshTokenModule } from "./refresh-token.module";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

describe("RefreshTokenModule", () => {
  let refreshTokenModule: RefreshTokenModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        RefreshTokenModule,
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

    refreshTokenModule = app.get<RefreshTokenModule>(RefreshTokenModule);
  });

  it("Should be defined", () => {
    expect(refreshTokenModule).toBeDefined();
  });
});
