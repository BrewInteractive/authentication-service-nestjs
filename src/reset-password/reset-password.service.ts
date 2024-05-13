import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User, UserResetPasswordRequest } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { ResetPasswordRequest } from "../reset-password/dto/reset-password-request.dto";

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserResetPasswordRequest)
    private readonly userResetPasswordRequestRepository: Repository<UserResetPasswordRequest>
  ) {}

  async resetPasswordAsync(
    resetPasswordRequest: ResetPasswordRequest
  ): Promise<void> {
    const userResetPasswordData = await this.getResetPasswordRequestAsync(
      resetPasswordRequest.key
    );

    const user = await this.getUserAsync(resetPasswordRequest.email);

    await this.validateResetPasswordRequestAsync(
      userResetPasswordData,
      resetPasswordRequest
    );

    this.updateUserPasswordAsync(user, resetPasswordRequest.newPassword);

    this.updateResetPasswordRequestExpirationAsync(userResetPasswordData);
  }

  async getResetPasswordRequestAsync(
    key: string
  ): Promise<UserResetPasswordRequest> {
    return await this.userResetPasswordRequestRepository.findOne({
      where: { key },
    });
  }

  private async getUserAsync(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }

  private async validateResetPasswordRequestAsync(
    userResetPasswordRequest: UserResetPasswordRequest,
    resetPasswordRequest: ResetPasswordRequest
  ) {
    if (!userResetPasswordRequest) {
      throw new UnauthorizedException("Invalid reset password request.");
    }

    if (
      userResetPasswordRequest.expiresAt &&
      userResetPasswordRequest.expiresAt < new Date()
    ) {
      throw new UnauthorizedException("Reset password request is expired.");
    }
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

  private async updateResetPasswordRequestExpirationAsync(
    resetPasswordRequest: UserResetPasswordRequest
  ): Promise<void> {
    resetPasswordRequest.expiresAt = new Date();
    await this.userResetPasswordRequestRepository.save(resetPasswordRequest);
  }
}
