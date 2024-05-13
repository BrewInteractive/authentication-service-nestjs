import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User, UserRole } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { IPreRegisterUserHandler } from "./interfaces/pre-register-user-handler.interface";
import { IPostRegisterUserHandler } from "./interfaces/post-register-user-handler.interface";
import { IUserValidator } from "./interfaces/user-validator.interface";

@Injectable()
export class UserService {
  private preRegisterUserHandlers: Array<IPreRegisterUserHandler> = [];
  private postRegisterUserHandlers: Array<IPostRegisterUserHandler> = [];
  private userValidators: Array<IUserValidator> = [];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>
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

    if (!userInformation)
      throw new UnauthorizedException("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      userInformation.passwordHash
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return userInformation;
  }

  async createUserAsync(user: User, appData?: object): Promise<User> {
    const existingUser = await this.getUserAsync({
      username: user.username,
      email: user.email,
    });

    if (existingUser) {
      throw new ConflictException("Username or email already exists");
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
        throw new UnauthorizedException("Invalid User.");
    }
  }
}
