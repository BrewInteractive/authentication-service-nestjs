import { Test } from "@nestjs/testing";
import { AuthModule } from "./auth.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../models/user.entity";

describe("AuthModule", () => {
  let authModule: AuthModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [AuthModule],
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
