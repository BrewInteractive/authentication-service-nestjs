import {
  Otp,
  RefreshToken,
  User,
  UserResetPasswordRequest,
  UserRole,
} from "../entities";

import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@nestjs/config";
import { SignUpModule } from "./sign-up.module";
import { Test } from "@nestjs/testing";
import { classes } from "@automapper/classes";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EventEmitterModule } from "@nestjs/event-emitter";

describe("SignUpModule", () => {
  let signUpModule: SignUpModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        SignUpModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        EventEmitterModule.forRoot(),
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
      .overrideProvider(getRepositoryToken(Otp))
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
