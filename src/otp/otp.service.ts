import { JsonContains, MoreThan, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { Otp } from "../entities";
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
  ): Promise<boolean> {
    const otpEntity = await this.otpRepository.findOne({
      where: {
        value: otpCode,
        channel: JsonContains({ email }),
        expiresAt: MoreThan(new Date()),
      },
    });

    return otpEntity ? true : false;
  }
}
