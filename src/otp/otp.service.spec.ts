import { FindOperator, JsonContains, Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";

import { ConfigModule } from "@nestjs/config";
import { MockFactory } from "mockingbird";
import { Otp } from "../entities";
import { OtpFixture } from "../../test/fixtures";
import { OtpNotFoundError } from "../error";
import { OtpService } from "./otp.service";
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

  it("should be successful when a valid email otp is provided.", async () => {
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

  it("should be successful when an invalid email otp is provided.", async () => {
    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(null));

    const actualResult = await otpService.validateEmailOtpAsync(
      faker.internet.email(),
      faker.string.sample(6)
    );

    expect(actualResult).toBe(false);
  });

  it("should be successful when a valid phone otp is provided.", async () => {
    const mockOtp = MockFactory(OtpFixture).one().withPhoneChannel();

    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(mockOtp));

    const actualResult = await otpService.validatePhoneOtpAsync(
      mockOtp.channel.phone,
      mockOtp.value
    );

    expect(actualResult).toBe(true);
    expect(otpRepository.findOne).toHaveBeenCalledWith({
      where: expect.objectContaining({
        value: mockOtp.value,
        channel: JsonContains(mockOtp.channel),
        expiresAt: expect.any(FindOperator),
      }),
    });
  });

  it("should be successful when an invalid phone otp is provided.", async () => {
    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(null));
    const phone = {
      country_code: faker.location.countryCode(),
      phone_number: faker.phone.number(),
    };
    const value = faker.string.sample(6);
    const actualResult = await otpService.validatePhoneOtpAsync(phone, value);

    expect(actualResult).toBe(false);
    expect(otpRepository.findOne).toHaveBeenCalledWith({
      where: expect.objectContaining({
        value: value,
        channel: JsonContains({ phone }),
        expiresAt: expect.any(FindOperator),
      }),
    });
  });

  it("New Email Otp must be created if there is not already one", async () => {
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

  it("New Phone Otp must be created if there is not already one", async () => {
    const createdOtp = MockFactory(OtpFixture).one().withPhoneChannel();

    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(null));

    jest
      .spyOn(otpRepository, "save")
      .mockResolvedValue(Promise.resolve(createdOtp));

    const actualResult = await otpService.createPhoneOtpAsync(
      createdOtp.channel.phone
    );

    expect(actualResult.otpValue).toBe(createdOtp.value);
    expect(actualResult.isSent).toBe(true);
    expect(actualResult.expiresAt).toBe(createdOtp.expiresAt);
  });

  it("New Email Otp must not be created if there already one", async () => {
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

  it("New Phone Otp must not be created if there already one", async () => {
    const unexpiredOtp = MockFactory(OtpFixture).one().withPhoneChannel();

    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(unexpiredOtp));

    const actualResult = await otpService.createPhoneOtpAsync(
      unexpiredOtp.channel.phone
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

  it("should return fake otp result", async () => {
    const actualResult = otpService.createFakeOtpResult();
    expect(actualResult).toHaveProperty("isSent");
    expect(actualResult).toHaveProperty("expiresAt");
  });
});
