import { Test, TestingModule } from "@nestjs/testing";

import { ConfigModule } from "@nestjs/config";
import { MockFactory } from "mockingbird";
import { Otp } from "../entities";
import { OtpFixture } from "../../test/fixtures";
import { OtpService } from "./otp.service";
import { Repository } from "typeorm";
import { faker } from "@faker-js/faker";

describe("OtpService", () => {
  let otpService: OtpService;
  let otpRepository: Repository<Otp>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
        OtpService,
        {
          provide: "OtpRepository",
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    otpService = module.get<OtpService>(OtpService);
    otpRepository = module.get<Repository<Otp>>("OtpRepository");
  });

  it("should be defined", () => {
    expect(otpService).toBeDefined();
  });

  it("should be successful otp verification by email", async () => {
    const mockOtp = MockFactory(OtpFixture).one().withEmailChannel();

    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(mockOtp));

    const actualResult = await otpService.validateEmailOtpAsync(
      mockOtp.channel.email,
      mockOtp.value
    );

    expect(actualResult).toBe(true);
  });

  it("should be unsuccessful otp verification by email", async () => {
    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(null));

    const actualResult = await otpService.validateEmailOtpAsync(
      faker.internet.email(),
      faker.datatype.string(6)
    );

    expect(actualResult).toBe(false);
  });
});
