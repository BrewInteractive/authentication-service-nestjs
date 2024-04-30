import {
  RefreshToken,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "../entities";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { LoginModule } from "./login.module";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("LoginModule", () => {
  let loginModule: LoginModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        LoginModule,
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

    loginModule = app.get<LoginModule>(LoginModule);
  });

  it("Should be defined", () => {
    expect(loginModule).toBeDefined();
  });
});
