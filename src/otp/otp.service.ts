import { JsonContains, MoreThan, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { Otp } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { SendOtpResult } from "./dto";
import { uid } from "uid";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private readonly configService: ConfigService
  ) {}

  async validateEmailOtpAsync(
    email: string,
    otpCode: string
  ): Promise<boolean> {
    const otpEntity = await this.otpRepository.findOne({
      where: {
        value: otpCode,
        channel: JsonContains({ email }),
        expiresAt: MoreThan(new Date()),
      },
    });

    return !!otpEntity;
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
      value: uid(6),
      channel,
      expiresAt: new Date(
        new Date().getTime() +
          this.configService.get<number>("otp.expiresIn") * 1000
      ),
    });

    return {
      isSent: true,
      expiresAt: otpEntity.expiresAt,
      code: otpEntity.value,
    };
  }

  async createEmailOtpAsync(email: string): Promise<SendOtpResult> {
    return this.createOtpAsync({
      email,
    });
  }
}
