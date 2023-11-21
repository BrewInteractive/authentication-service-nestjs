import {
  RefreshToken,
  Role,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "./entities";

import { AppModule } from "./app.module";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("AppModule", () => {
  let appModule: AppModule;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(RefreshToken))
      .useValue({
        save: jest.fn(),
        findOne: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(UserRole))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(UserResetPasswordRequest))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(Role))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .compile();

    appModule = module.get<AppModule>(AppModule);
  });

  it("should be defined", () => {
    expect(appModule).toBeDefined();
  });
});
