import { JsonContains, MoreThan, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { Otp } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { SendOtpResult } from "./dto";
import { uid } from "uid";
import { ConfigService } from "@nestjs/config";
import { OtpNotFoundError } from "../error";

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private readonly configService: ConfigService
  ) {}

  async validateEmailOtpAsync(
    email: string,
    otpValue: string
  ): Promise<boolean> {
    const otpEntity = await this.otpRepository.findOne({
      where: {
        value: otpValue,
        channel: JsonContains({ email }),
        expiresAt: MoreThan(new Date()),
      },
    });

    return !!otpEntity;
  }

  async createEmailOtpAsync(email: string): Promise<SendOtpResult> {
    return await this.createOtpAsync({
      email,
    });
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
  }): Promise<SendOtpResult> {
    const activeOtp = await this.otpRepository.findOne({
      where: {
        channel: JsonContains(channel),
        expiresAt: MoreThan(new Date()),
      },
    });

    if (activeOtp) return { isSent: false, expiresAt: activeOtp.expiresAt };

    const otpEntity = await this.otpRepository.save({
      value: uid(6).toUpperCase(),
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
}
