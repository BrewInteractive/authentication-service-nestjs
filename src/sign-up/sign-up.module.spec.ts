import {
  RefreshToken,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "../entities";

import { ConfigModule } from "@nestjs/config";
import { SignUpModule } from "./sign-up.module";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("SignUpModule", () => {
  let signUpModule: SignUpModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        SignUpModule,
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
      .overrideProvider(getRepositoryToken(UserResetPasswordRequest))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(RefreshToken))
      .useValue({
        save: jest.fn(),
        findOne: jest.fn(),
      })
      .compile();

    signUpModule = app.get<SignUpModule>(SignUpModule);
  });

  it("Should be defined", () => {
    expect(signUpModule).toBeDefined();
  });
});
