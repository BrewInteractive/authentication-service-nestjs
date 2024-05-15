import { Injectable } from "@nestjs/common";
import { User, UserResetPasswordRequest } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import * as bcrypt from "bcrypt";
import { InvalidResetPasswordRequestError } from "../error/invalid-reset-password-request.error";

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserResetPasswordRequest)
    private readonly userResetPasswordRequestRepository: Repository<UserResetPasswordRequest>
  ) {}

  async resetPasswordAsync(
    user: User,
    newPassword: string,
    key: string
  ): Promise<void> {
    const userResetPasswordRequest = await this.getResetPasswordRequestAsync(
      key
    );

    if (!userResetPasswordRequest) throw new InvalidResetPasswordRequestError();

    await this.updateUserPasswordAsync(user, newPassword);

    await this.expireResetPasswordRequestAsync(userResetPasswordRequest);
  }

  async getResetPasswordRequestAsync(
    key: string
  ): Promise<UserResetPasswordRequest> {
    return await this.userResetPasswordRequestRepository.findOne({
      where: { key, expiresAt: MoreThan(new Date()) },
    });
  }

  private async updateUserPasswordAsync(
    user: User,
    newPassword: string
  ): Promise<void> {
    const newSalt = bcrypt.genSaltSync();
    user.passwordHash = bcrypt.hashSync(newPassword, newSalt);
    user.passwordSalt = newSalt;
    await this.userRepository.save(user);
  }

  private async expireResetPasswordRequestAsync(
    resetPasswordRequest: UserResetPasswordRequest
  ): Promise<void> {
    resetPasswordRequest.expiresAt = new Date();
    await this.userResetPasswordRequestRepository.save(resetPasswordRequest);
  }
}
