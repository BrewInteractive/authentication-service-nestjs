import { User, UserRole } from "../entities";

import { AuthModule } from "./auth.module";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("AuthModule", () => {
  let authModule: AuthModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [AuthModule],
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
      .compile();

    authModule = app.get<AuthModule>(AuthModule);
  });

  it("Should be defined", () => {
    expect(authModule).toBeDefined();
  });
});
