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

  async getUserByUsernameAndEmailAsync(
    username: string,
    email: string
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (user) return user;
    return null;
  }

  async getUserByUsernameOrEmailAsync(usernameOrEmail: string): Promise<User> {
    return this.getUserByUsernameAndEmailAsync(usernameOrEmail, usernameOrEmail);
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

  async createUserAsync(user: User): Promise<User> {
    const existingUser = await this.getUserByUsernameAndEmailAsync(
      user.username,
      user.email
    );

    if (existingUser) {
      throw new ConflictException("Username or email already exists");
    }

    return this.userRepository.save(user);
  }
}
