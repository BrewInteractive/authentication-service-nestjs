import { ConfigModule } from "@nestjs/config";
import { Otp } from "../entities";
import { OtpModule } from "./otp.module";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("OtpModule", () => {
  let otpModule: OtpModule;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        OtpModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
    })
      .overrideProvider(getRepositoryToken(Otp))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .compile();

    otpModule = module.get<OtpModule>(OtpModule);
  });

  it("should be defined", () => {
    expect(otpModule).toBeDefined();
  });
});
