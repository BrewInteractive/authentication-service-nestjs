import { User, UserRole } from "../entities";

import { LoginModule } from "./login.module";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("LoginModule", () => {
  let loginModule: LoginModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [LoginModule],
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

      loginModule = app.get<LoginModule>(LoginModule);
  });

  it("Should be defined", () => {
    expect(loginModule).toBeDefined();
  });
});
