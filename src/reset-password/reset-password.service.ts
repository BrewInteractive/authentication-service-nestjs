import { Inject, Injectable } from "@nestjs/common";
import { User, UserResetPasswordRequest } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { InvalidResetPasswordRequestError } from "../error/invalid-reset-password-request.error";
import { UserService } from "../user/user.service";
import { authenticationConfig } from "../config";

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

  async createResetPasswordRequest(
    email: string
  ): Promise<UserResetPasswordRequest> {
    const activeUserResetPasswordRequest =
      await this.getActiveResetPasswordRequestByEmail(email);

    if (
      activeUserResetPasswordRequest &&
      activeUserResetPasswordRequest.resendableAt > new Date()
    ) {
      return null;
    }

    const createdUserResetPasswordRequest =
      this.createResetPassworRequest(email);

    return await this.userResetPasswordRequestRepository.save(
      createdUserResetPasswordRequest
    );
  }

  private createResetPassworRequest(email: string): UserResetPasswordRequest {
    const currentTime = new Date();

    const resendableAt =
      authenticationConfig().resetPassword.resendableAt !== 0
        ? new Date(
            currentTime.getDate() +
              authenticationConfig().resetPassword.resendableAt
          )
        : null;

    const expiresAt = new Date(
      currentTime.getDate() + authenticationConfig().resetPassword.expiresAt
    );

    const userResetPasswordRequest = new UserResetPasswordRequest();
    userResetPasswordRequest.email = email;
    userResetPasswordRequest.createdAt = currentTime;
    userResetPasswordRequest.expiresAt = expiresAt;
    userResetPasswordRequest.resendableAt = resendableAt;

    return userResetPasswordRequest;
  }

  private async getActiveResetPasswordRequestByEmail(
    email: string
  ): Promise<UserResetPasswordRequest> {
    const activeResetPasswordRequest =
      await this.userResetPasswordRequestRepository.findOne({
        where: [{ email: email }, { expiresAt: MoreThan(new Date()) }],
      });
    return activeResetPasswordRequest;
  }

  private async expireResetPasswordRequestAsync(
    resetPasswordRequest: UserResetPasswordRequest
  ): Promise<void> {
    resetPasswordRequest.expiresAt = new Date();
    await this.userResetPasswordRequestRepository.save(resetPasswordRequest);
  }
}
