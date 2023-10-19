import { User, UserRole } from "../entities";

import { SignUpModule } from "./sign-up.module";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("SignUpModule", () => {
  let signUpModule: SignUpModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [SignUpModule],
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

      signUpModule = app.get<SignUpModule>(SignUpModule);
  });

  it("Should be defined", () => {
    expect(signUpModule).toBeDefined();
  });
});