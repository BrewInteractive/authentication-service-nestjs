import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User, UserRole } from "../models";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { IRegisterUserImporter } from "./interfaces/register-user-importer.interface";

@Injectable()
export class UserService {
  private preRegisterUserImporters: Array<IRegisterUserImporter> = [];
  private postRegisterUserImporters: Array<IRegisterUserImporter> = [];

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

  async validateUserPasswordAsync(
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

    await this.applyPreRegisterUserImportersAsync(user, appData);
    const insertedUser = await this.insertUserAsync(user);
    await this.applyPostRegisterUserImportersAsync(insertedUser, appData);

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

  addPreRegisterUserImporter(importer: IRegisterUserImporter) {
    this.preRegisterUserImporters.push(importer);
  }

  addPostRegisterUserImporter(importer: IRegisterUserImporter) {
    this.postRegisterUserImporters.push(importer);
  }

  private async applyPreRegisterUserImportersAsync(
    user: User,
    appData: object
  ) {
    for (const preRegisterUserImporter of this.preRegisterUserImporters) {
      await preRegisterUserImporter.createUserAsync(user, appData);
    }
  }

  private async applyPostRegisterUserImportersAsync(
    user: User,
    appData: object
  ) {
    for (const preRegisterUserImporter of this.postRegisterUserImporters) {
      await preRegisterUserImporter.createUserAsync(user, appData);
    }
  }
}
