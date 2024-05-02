import { JsonContains, MoreThan, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { Otp } from "../entities";
import { ValidateOtpResult } from "./dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>
  ) {}

  async validateEmailOtpAsync(
    email: string,
    otpCode: string
  ): Promise<ValidateOtpResult> {
    const otpEntity = await this.otpRepository.findOne({
      where: {
        value: otpCode,
        channel: JsonContains({ email }),
        expiresAt: MoreThan(new Date()),
      },
    });

    if (otpEntity)
      return {
        isValid: true,
        expiresAt: otpEntity.expiresAt,
      };

    return { isValid: false, expiresAt: null };
  }
}
