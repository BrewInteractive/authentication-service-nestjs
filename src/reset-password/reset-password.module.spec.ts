import { User, UserResetPasswordRequest, UserRole } from "../entities";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { EmailConfigFixture } from "../../test/fixtures";
import { MockFactory } from "mockingbird";
import { ResetPasswordModule } from "./reset-password.module";
import { Test } from "@nestjs/testing";
import { authenticationConfig } from "../config";
import { classes } from "@automapper/classes";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("ResetPasswordModule", () => {
  let resetPasswordModule: ResetPasswordModule;

  beforeEach(async () => {
    const emailConfig = () => MockFactory(EmailConfigFixture).one();
    const app = await Test.createTestingModule({
      imports: [
        ResetPasswordModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [authenticationConfig, emailConfig],
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
