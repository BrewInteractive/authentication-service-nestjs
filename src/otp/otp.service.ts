import { JsonContains, MoreThan, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { Otp } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { SendOtpResult } from "./dto";
import { ConfigService } from "@nestjs/config";
import { OtpNotFoundError } from "../error";
import { OtpValue } from "../utils/otp-value";
import { faker } from "@faker-js/faker";

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private readonly configService: ConfigService
  ) {}

  async validateOtpAsync(
    channel: {
      email?: string;
      phone?: {
        country_code: string;
        phone_number: string;
      };
    },
    otpValue: string
  ): Promise<boolean> {
    const otpEntity = await this.otpRepository.findOne({
      where: {
        value: otpValue,
        channel: JsonContains(channel),
        expiresAt: MoreThan(new Date()),
      },
    });
    return !!otpEntity;
  }

  async validateEmailOtpAsync(
    email: string,
    otpValue: string
  ): Promise<boolean> {
    return await this.validateOtpAsync({ email }, otpValue);
  }

  async validatePhoneOtpAsync(
    phone: {
      country_code: string;
      phone_number: string;
    },
    otpValue: string
  ): Promise<boolean> {
    return await this.validateOtpAsync(
      {
        phone,
      },
      otpValue
    );
  }

  async createEmailOtpAsync(email: string): Promise<SendOtpResult> {
    return await this.createOtpAsync({
      email,
    });
  }

  async createPhoneOtpAsync(phone: {
    country_code: string;
    phone_number: string;
  }): Promise<SendOtpResult> {
    return await this.createOtpAsync({ phone: phone });
  }

  async expireOtpAsync(channel: { email?: string }): Promise<void> {
    const entity = await this.otpRepository.findOne({
      where: {
        channel: JsonContains(channel),
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!entity) throw new OtpNotFoundError();

    this.otpRepository.update(entity.id, {
      expiresAt: new Date(),
    });
  }

  private async createOtpAsync(channel: {
    email?: string;
    phone?: {
      country_code: string;
      phone_number: string;
    };
  }): Promise<SendOtpResult> {
    const activeOtp = await this.otpRepository.findOne({
      where: {
        channel: JsonContains(channel),
        expiresAt: MoreThan(new Date()),
      },
    });

    if (activeOtp) return { isSent: false, expiresAt: activeOtp.expiresAt };

    const otpEntity = await this.otpRepository.save({
      value: OtpValue.generate(6),
      channel,
      expiresAt: new Date(
        new Date().getTime() +
          this.configService.get<number>("otp.expiresIn") * 1000
      ),
    });

    return {
      isSent: true,
      expiresAt: otpEntity.expiresAt,
      otpValue: otpEntity.value,
    };
  }

  createFakeOtpResult(): SendOtpResult {
    return {
      isSent: faker.datatype.boolean(),
      expiresAt: new Date(
        new Date().getTime() +
          this.configService.get<number>("otp.expiresIn") * 1000
      ),
    };
  }
}
