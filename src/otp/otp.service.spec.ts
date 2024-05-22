import { Test, TestingModule } from "@nestjs/testing";

import { ConfigModule } from "@nestjs/config";
import { MockFactory } from "mockingbird";
import { Otp } from "../entities";
import { OtpFixture } from "../../test/fixtures";
import { OtpService } from "./otp.service";
import { Repository } from "typeorm";
import { faker } from "@faker-js/faker";
import { OtpNotFoundError } from "../error";

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
            update: jest.fn(),
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

  it("should be successful when a valid otp is provided.", async () => {
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

  it("should be successful when an invalid otp is provided.", async () => {
    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(null));

    const actualResult = await otpService.validateEmailOtpAsync(
      faker.internet.email(),
      faker.string.sample(6)
    );

    expect(actualResult).toBe(false);
  });

  it("New Otp must be created if there is not already one", async () => {
    const createdOtp = MockFactory(OtpFixture).one().withEmailChannel();

    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(null));

    jest
      .spyOn(otpRepository, "save")
      .mockResolvedValue(Promise.resolve(createdOtp));

    const actualResult = await otpService.createEmailOtpAsync(
      createdOtp.channel.email
    );

    expect(actualResult.otpValue).toBe(createdOtp.value);
    expect(actualResult.isSent).toBe(true);
    expect(actualResult.expiresAt).toBe(createdOtp.expiresAt);
  });

  it("New Otp must not be created if there already one", async () => {
    const unexpiredOtp = MockFactory(OtpFixture).one().withEmailChannel();

    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(unexpiredOtp));

    const actualResult = await otpService.createEmailOtpAsync(
      unexpiredOtp.channel.email
    );

    expect(actualResult.otpValue).toBe(undefined);
    expect(actualResult.isSent).toBe(false);
    expect(actualResult.expiresAt).toBe(unexpiredOtp.expiresAt);
  });

  it("should update expiry time for valid OTP", async () => {
    const unexpiredOtp = MockFactory(OtpFixture).one().withEmailChannel();

    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(unexpiredOtp));

    await otpService.expireOtpAsync({ email: unexpiredOtp.channel.email });

    expect(otpRepository.update).toHaveBeenCalledWith(unexpiredOtp.id, {
      expiresAt: expect.any(Date),
    });
  });

  it("should throw otp not found error", async () => {
    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(null));

    await expect(
      otpService.expireOtpAsync({ email: faker.internet.email() })
    ).rejects.toThrow(OtpNotFoundError);

    expect(otpRepository.update).not.toHaveBeenCalled();
  });
});
