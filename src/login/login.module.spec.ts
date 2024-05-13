import {
  Otp,
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
import {EventEmitterModule} from '@nestjs/event-emitter';

describe("LoginModule", () => {
  let loginModule: LoginModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        LoginModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        EventEmitterModule.forRoot(),
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
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(RefreshToken))
      .useValue({
        save: jest.fn(),
        findOne: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(Otp))
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
