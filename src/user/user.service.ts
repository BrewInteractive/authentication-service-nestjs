import { Injectable } from "@nestjs/common";
import { User, UserResetPasswordRequest, UserRole } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { IPreRegisterUserHandler } from "./interfaces/pre-register-user-handler.interface";
import { IPostRegisterUserHandler } from "./interfaces/post-register-user-handler.interface";
import { IUserValidator } from "./interfaces/user-validator.interface";
import { ResetPasswordRequest } from "../reset-password/dto/reset-password-request.dto";
import { InvalidCredentialsError } from "../exception/invalid-credentials.error";
import { UserExistsError } from "../exception/user-exists.error";
import { InvalidUserError } from "../exception/invalid-user.error";
import { InvalidResetPasswordRequestError } from "../exception/invalid-reset-password-request.error";

@Injectable()
export class UserService {
  private preRegisterUserHandlers: Array<IPreRegisterUserHandler> = [];
  private postRegisterUserHandlers: Array<IPostRegisterUserHandler> = [];
  private userValidators: Array<IUserValidator> = [];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserResetPasswordRequest)
    private readonly userResetPasswordRequestRepository: Repository<UserResetPasswordRequest>
  ) {}

  async getUserAsync(options: {
    username?: string;
    email?: string;
  }): Promise<User | null> {
    if (!options.username && !options.email)
      throw new Error("At least one of username or email must be provided.");

    const whereClause = [];
    if (options.username) whereClause.push({ username: options.username });
    if (options.email) whereClause.push({ email: options.email });

    const user = await this.userRepository.findOne({
      where: whereClause,
      relations: ["roles", "roles.role"],
    });
    if (user) return user;
    return null;
  }

  async validateUserAsync(credentials: {
    username?: string;
    email?: string;
    password: string;
  }): Promise<User> {
    const user = await this.validateUserPasswordAsync(credentials);

    await this.applyUserValidatorsAsync(user);

    return user;
  }

  private async validateUserPasswordAsync(credentials: {
    username?: string;
    email?: string;
    password: string;
  }): Promise<User> {
    const userInformation = await this.getUserAsync({
      username: credentials.username,
      email: credentials.email,
    });

    if (!userInformation) throw new InvalidCredentialsError();

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      userInformation.passwordHash
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }
    return userInformation;
  }

  async createUserAsync(user: User, appData?: object): Promise<User> {
    const existingUser = await this.getUserAsync({
      username: user.username,
      email: user.email,
    });

    if (existingUser) {
      throw new UserExistsError();
    }

    user = await this.applyPreRegisterUserHandlersAsync(user, appData);
    user = await this.insertUserAsync(user);
    user = await this.applyPostRegisterUserHandlersAsync(user, appData);

    return user;
  }

  private async insertUserAsync(user: User) {
    const savedUser = await this.userRepository.save(user);

    if (user.roles) {
      const roles = user.roles.map((userRoles) => ({
        ...userRoles,
        user: savedUser,
      }));

      savedUser.roles = await this.userRoleRepository.save(roles);
    }

    return savedUser;
  }

  addPreRegisterUserHandler(handler: IPreRegisterUserHandler) {
    this.preRegisterUserHandlers.push(handler);
  }

  addPostRegisterUserHandler(handler: IPostRegisterUserHandler) {
    this.postRegisterUserHandlers.push(handler);
  }

  addUserValidator(userValidator: IUserValidator) {
    this.userValidators.push(userValidator);
  }

  private async applyPreRegisterUserHandlersAsync(
    user: User,
    appData: object
  ): Promise<User> {
    for (const preRegisterUserHandler of this.preRegisterUserHandlers) {
      user = await preRegisterUserHandler.handleAsync(user, appData);
    }
    return user;
  }

  private async applyPostRegisterUserHandlersAsync(
    user: User,
    appData: object
  ): Promise<User> {
    for (const preRegisterUserHandler of this.postRegisterUserHandlers) {
      user = await preRegisterUserHandler.handleAsync(user, appData);
    }
    return user;
  }

  private async applyUserValidatorsAsync(user: User) {
    for (const userValidator of this.userValidators) {
      if (!(await userValidator.validateAsync(user)))
        throw new InvalidUserError();
    }
  }

  async resetPasswordAsync(
    resetPasswordRequest: ResetPasswordRequest
  ): Promise<void> {
    const userResetPasswordData = await this.getResetPasswordRequestAsync(
      resetPasswordRequest.key
    );
    const user = await this.validateResetPasswordRequestAsync(
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

  async getResetPasswordRequestByIdAsync(
    id: number
  ): Promise<UserResetPasswordRequest> {
    return await this.userResetPasswordRequestRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  private async validateResetPasswordRequestAsync(
    userResetPasswordRequest: UserResetPasswordRequest,
    resetPasswordRequest: ResetPasswordRequest
  ): Promise<User> {
    if (!userResetPasswordRequest) {
      //reset password request not exists with given key
      throw new InvalidResetPasswordRequestError(
        "Invalid reset password request."
      );
    }
    const user = await this.getUserAsync({
      email: resetPasswordRequest.email,
    });
    if (!user) {
      //user not exists with given email address
      throw new InvalidResetPasswordRequestError(
        "Invalid reset password request."
      );
    }
    if (
      userResetPasswordRequest.expiresAt &&
      userResetPasswordRequest.expiresAt < new Date()
    ) {
      throw new InvalidResetPasswordRequestError(
        "Reset password request is expired."
      );
    }
    return user;
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
