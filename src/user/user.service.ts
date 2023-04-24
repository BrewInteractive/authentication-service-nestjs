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

  async getUserAsync(username: string, email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (user) return user;
    return null;
  }

  async validateUserAsync(user: User): Promise<User> {
    const userInformation = await this.getUserAsync(user.username, user.email);

    if (!userInformation) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(
      user.password,
      userInformation.passwordHash
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return userInformation;
  }

  async createUserAsync(user: User): Promise<User> {
    const { username, email, password } = user;

    const existingUser = await this.getUserAsync(username, email);

    if (existingUser) {
      throw new ConflictException("Username or email already exists");
    }

    user.passwordSalt = await bcrypt.genSalt();
    user.passwordHash = await bcrypt.hash(password, user.passwordSalt);

    return this.userRepository.save(user);
  }
}
