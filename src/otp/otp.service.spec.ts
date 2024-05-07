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
      faker.datatype.string(6)
    );

    expect(actualResult).toBe(false);
  });

  it("OTP should be created for email sending", async () => {
    const mockOtp = MockFactory(OtpFixture).one().withEmailChannel();

    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(null));

    jest
      .spyOn(otpRepository, "save")
      .mockResolvedValue(Promise.resolve(mockOtp));

    const actualResult = await otpService.createEmailOtpAsync(
      mockOtp.channel.email
    );

    expect(actualResult.code).toBe(mockOtp.value);
    expect(actualResult.isSent).toBe(true);
    expect(actualResult.expiresAt).toBe(mockOtp.expiresAt);
  });

  it("new OTP should not be created to send email", async () => {
    const mockOtp = MockFactory(OtpFixture).one().withEmailChannel();

    jest
      .spyOn(otpRepository, "findOne")
      .mockResolvedValue(Promise.resolve(mockOtp));

    jest.spyOn(otpRepository, "save").mockResolvedValue(Promise.resolve(null));

    const actualResult = await otpService.createEmailOtpAsync(
      mockOtp.channel.email
    );

    expect(otpRepository.save).not.toBeCalled();
    expect(actualResult.code).toBe(undefined);
    expect(actualResult.isSent).toBe(false);
    expect(actualResult.expiresAt).toBe(mockOtp.expiresAt);
  });
});
