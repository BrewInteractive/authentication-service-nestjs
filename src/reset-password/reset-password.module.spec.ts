import { AUTHENTICATION_CONFIGURATIONS, EMAIL_CONFIGURATIONS } from "../config";
import { User, UserResetPasswordRequest, UserRole } from "../entities";

import { ConfigModule } from "@nestjs/config";
import { ResetPasswordModule } from "./reset-password.module";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("ResetPasswordModule", () => {
  let resetPasswordModule: ResetPasswordModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        ResetPasswordModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [AUTHENTICATION_CONFIGURATIONS, EMAIL_CONFIGURATIONS],
        }),
      ],
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
      .compile();

    resetPasswordModule = app.get<ResetPasswordModule>(ResetPasswordModule);
  });

  it("Should be defined", () => {
    expect(resetPasswordModule).toBeDefined();
  });
});
