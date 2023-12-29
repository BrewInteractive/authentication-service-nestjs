import { User, UserResetPasswordRequest, UserRole } from "../entities";

import { ResetPasswordModule } from "./reset-password.module";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MockFactory } from "mockingbird";
import { ConfigFixture } from "../../test/fixtures";
import { ConfigModule } from "@nestjs/config";

describe("ResetPasswordModule", () => {
  let resetPasswordModule: ResetPasswordModule;
  const mockConfig = MockFactory(ConfigFixture).one();

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        ResetPasswordModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => mockConfig],
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
