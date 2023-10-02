import { User, UserRole } from "../entities";

import { Test } from "@nestjs/testing";
import { UserModule } from "./user.module";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("UserModule", () => {
  let userModule: UserModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [UserModule],
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
      .compile();

    userModule = app.get<UserModule>(UserModule);
  });

  it("Should be defined", () => {
    expect(userModule).toBeDefined();
  });
});
