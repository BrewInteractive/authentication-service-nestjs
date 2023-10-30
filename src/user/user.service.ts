import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User, UserResetPasswordRequest, UserRole } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { IPreRegisterUserHandler } from "./interfaces/pre-register-user-handler.interface";
import { IPostRegisterUserHandler } from "./interfaces/post-register-user-handler.interface";
import { IUserValidator } from "./interfaces/user-validator.interface";
import { ResetPasswordRequest } from "../reset-password/dto/reset-password-request.dto";

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

  async getUserByUsernameAndEmailAsync(
    username: string,
    email: string
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
      relations: ["roles", "roles.role"],
    });
    if (user) return user;
    return null;
  }

  async getUserByUsernameOrEmailAsync(usernameOrEmail: string): Promise<User> {
    return this.getUserByUsernameAndEmailAsync(
      usernameOrEmail,
      usernameOrEmail
    );
  }

  async validateUserAsync(
    usernameOrEmail: string,
    password: string
  ): Promise<User> {
    const user = await this.validateUserPasswordAsync(
      usernameOrEmail,
      password
    );

    await this.applyUserValidatorsAsync(user);

    return user;
  }

  private async validateUserPasswordAsync(
    usernameOrEmail: string,
    password: string
  ): Promise<User> {
    const userInformation = await this.getUserByUsernameOrEmailAsync(
      usernameOrEmail
    );

    if (!userInformation) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      userInformation.passwordHash
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return userInformation;
  }

  async createUserAsync(user: User, appData?: object): Promise<User> {
    const existingUser = await this.getUserByUsernameAndEmailAsync(
      user.username,
      user.email
    );

    if (existingUser) {
      throw new ConflictException("Username or email already exists");
    }

    user = await this.applyPreRegisterUserHandlersAsync(user, appData);
    const insertedUser = await this.insertUserAsync(user);
    await this.applyPostRegisterUserHandlersAsync(insertedUser, appData);

    return insertedUser;
  }

  private async insertUserAsync(user: User) {
    const savedUser = await this.userRepository.save(user);

    if (user?.roles) {
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
        throw new UnauthorizedException("Invalid User.");
    }
  }

  async resetPasswordAsync(
    resetPasswordRequest: ResetPasswordRequest
  ): Promise<void> {
    const userResetPasswordData = await this.getResetPasswordRequestAsync(
      resetPasswordRequest.key
    );

    this.validateResetPasswordRequest(userResetPasswordData, resetPasswordRequest);
    this.updateUserPasswordAsync(
      userResetPasswordData.user,
      resetPasswordRequest.newPassword
    );
    this.updateResetPasswordRequestExpirationAsync(userResetPasswordData);
  }

  async getResetPasswordRequestAsync(
    key: string
  ): Promise<UserResetPasswordRequest> {
    return await this.userResetPasswordRequestRepository.findOne({
      where: { key },
      relations: ["user"],
    });
  }

  private validateResetPasswordRequest(
    userResetPasswordRequest: UserResetPasswordRequest,
    resetPasswordRequest: ResetPasswordRequest
  ): void {
    if (
      !userResetPasswordRequest ||
      Number(userResetPasswordRequest.user.id) !== resetPasswordRequest.userId
    ) {
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
