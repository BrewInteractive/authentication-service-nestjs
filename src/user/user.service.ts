import { Injectable } from "@nestjs/common";
import { User, UserRole } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { IPreRegisterUserHandler } from "./interfaces/pre-register-user-handler.interface";
import { IPostRegisterUserHandler } from "./interfaces/post-register-user-handler.interface";
import { IUserValidator } from "./interfaces/user-validator.interface";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../error";
import { InvalidArgumentError } from "../error/invalid-argument.error";
import { IGetUser } from "./interfaces/get-user.interface";

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

  async getUserAsync(options: IGetUser): Promise<User | null> {
    if (
      !options.username &&
      !options.email &&
      (!options.phone?.number || !options.phone?.countryCode)
    )
      throw new InvalidArgumentError(
        "Provide at least one of: username, email, or phone number."
      );

    const whereClause = [] as FindOptionsWhere<User>[];
    if (options.username) whereClause.push({ username: options.username });
    if (options.email) whereClause.push({ email: options.email });
    if (options.phone) {
      whereClause.push({
        phoneNumber: options.phone.number,
        countryCode: options.phone.countryCode,
      });
    }

    return await this.userRepository.findOne({
      where: whereClause,
      relations: ["roles", "roles.role"],
    });
  }

  async validateUserAsync(credentials: {
    username?: string;
    email?: string;
    password: string;
  }): Promise<User> {
    const user = await this.validateUserPasswordAsync(credentials);

    const isUserValid = await this.applyUserValidatorsAsync(user);

    if (!isUserValid) throw new InvalidCredentialsError();

    return user;
  }

  private async validateUserPasswordAsync(credentials: {
    username?: string;
    email?: string;
    password: string;
  }): Promise<User> {
    const user = await this.getUserAsync({
      username: credentials.username,
      email: credentials.email,
    });

    if (!user) throw new InvalidCredentialsError();

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.passwordHash
    );
    if (!isPasswordValid) throw new InvalidCredentialsError();

    return user;
  }

  async createUserAsync(user: User, appData?: object): Promise<User> {
    user = await this.applyPreRegisterUserHandlersAsync(user, appData);

    const existingUser = await this.getUserAsync({
      username: user.username,
      email: user.email,
      phone: { number: user.phoneNumber, countryCode: user.countryCode },
    });

    if (existingUser) throw new UserAlreadyExistsError();

    user = await this.insertUserAsync(user);
    user = await this.applyPostRegisterUserHandlersAsync(user, appData);

    return user;
  }

  async updateUserPasswordAsync(
    user: User,
    newPassword: string
  ): Promise<void> {
    const newSalt = bcrypt.genSaltSync();
    user.passwordHash = bcrypt.hashSync(newPassword, newSalt);
    user.passwordSalt = newSalt;
    await this.userRepository.save(user);
  }

  private async insertUserAsync(user: User): Promise<User> {
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
    for (const preRegisterUserHandler of this.preRegisterUserHandlers)
      user = await preRegisterUserHandler.handleAsync(user, appData);

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

  private async applyUserValidatorsAsync(user: User): Promise<boolean> {
    for (const userValidator of this.userValidators) {
      const isValid = await userValidator.validateAsync(user);
      if (!isValid) return false;
    }
    return true;
  }
}
