import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "../models/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getUserByUsernameAndEmail(
    username: string,
    email: string
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (user) return user;
    return null;
  }

  async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    return this.getUserByUsernameAndEmail(usernameOrEmail, usernameOrEmail);
  }

  async validateUserPasswordAsync(
    usernameOrEmail: string,
    password: string
  ): Promise<User> {
    const userInformation = await this.getUserByUsernameOrEmail(
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

  async createUserAsync(user: User): Promise<User> {
    const existingUser = await this.getUserByUsernameAndEmail(
      user.username,
      user.email
    );

    if (existingUser) {
      throw new ConflictException("Username or email already exists");
    }

    return this.userRepository.save(user);
  }
}
