import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User, UserRole } from "../models";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { IPreRegisterUserHandler } from "./interfaces/pre-register-user-handler.interface";
import { IPostRegisterUserHandler } from "./interfaces/post-register-user-handler.interface";
import { IValidateUserImporter } from "./interfaces/validate-user-importer.interface";

@Injectable()
export class UserService {
  private preRegisterUserHandlers: Array<IPreRegisterUserHandler> = [];
  private postRegisterUserHandlers: Array<IPostRegisterUserHandler> = [];
  private validateUserImporters: Array<IValidateUserImporter> = [];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>
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

    await this.applyValidateUserImportersAsync(user);

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

    await this.applyPreRegisterUserHandlersAsync(user, appData);
    const insertedUser = await this.insertUserAsync(user);
    await this.applyPostRegisterUserHandlersAsync(insertedUser, appData);

    return insertedUser;
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

  addValidateUserImporter(importer: IValidateUserImporter) {
    this.validateUserImporters.push(importer);
  }

  private async applyPreRegisterUserHandlersAsync(user: User, appData: object) {
    for (const preRegisterUserHandler of this.preRegisterUserHandlers) {
      await preRegisterUserHandler.handleAsync(user, appData);
    }
  }

  private async applyPostRegisterUserHandlersAsync(
    user: User,
    appData: object
  ) {
    for (const preRegisterUserHandler of this.postRegisterUserHandlers) {
      await preRegisterUserHandler.handleAsync(user, appData);
    }
  }

  private async applyValidateUserImportersAsync(user: User) {
    for (const validateUserImporter of this.validateUserImporters) {
      if (!(await validateUserImporter.validateUserAsync(user)))
        throw new UnauthorizedException("Invalid User.");
    }
  }
}
