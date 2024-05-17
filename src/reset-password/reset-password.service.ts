import { Inject, Injectable } from "@nestjs/common";
import { User, UserResetPasswordRequest } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { InvalidResetPasswordRequestError } from "../error/invalid-reset-password-request.error";
import { UserService } from "../user/user.service";

@Injectable()
export class ResetPasswordService {
  constructor(
    @Inject("UserService") private readonly userService: UserService,
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

    await this.userService.updateUserPasswordAsync(user, newPassword);

    await this.expireResetPasswordRequestAsync(userResetPasswordRequest);
  }

  async getResetPasswordRequestAsync(
    key: string
  ): Promise<UserResetPasswordRequest> {
    return await this.userResetPasswordRequestRepository.findOne({
      where: { key, expiresAt: MoreThan(new Date()) },
    });
  }

  private async expireResetPasswordRequestAsync(
    resetPasswordRequest: UserResetPasswordRequest
  ): Promise<void> {
    resetPasswordRequest.expiresAt = new Date();
    await this.userResetPasswordRequestRepository.save(resetPasswordRequest);
  }
}
