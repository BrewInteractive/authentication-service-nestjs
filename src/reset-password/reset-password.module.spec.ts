import { User, UserResetPasswordRequest, UserRole } from "../entities";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { EmailConfigFixture } from "../../test/fixtures";
import { MockFactory } from "mockingbird";
import { ResetPasswordModule } from "./reset-password.module";
import { Test } from "@nestjs/testing";
import { UserModule } from "../user/user.module";
import { authenticationConfig } from "../config";
import { classes } from "@automapper/classes";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("ResetPasswordModule", () => {
  let resetPasswordModule: ResetPasswordModule;
  let userModule: UserModule;

  beforeEach(async () => {
    const emailConfig = () => MockFactory(EmailConfigFixture).one();
    const app = await Test.createTestingModule({
      imports: [
        ResetPasswordModule,
        UserModule,
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
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(UserResetPasswordRequest))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .compile();

    resetPasswordModule = app.get<ResetPasswordModule>(ResetPasswordModule);
    userModule = app.get<UserModule>(UserModule);
  });

  it("Should be defined", () => {
    expect(resetPasswordModule).toBeDefined();
    expect(userModule).toBeDefined();
  });
});
