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

  async getUser(username: string, email: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ username }, { email }],
    });
  }

  async validateUser(user: User): Promise<User> {
    const userInformation = await this.getUser(user.username, user.email);

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

  async createUser(user: User): Promise<User> {
    const { username, email, password } = user;

    const existingUser = await this.getUser(username, email);

    if (existingUser) {
      throw new ConflictException("Username or email already exists");
    }

    user.passwordSalt = await bcrypt.genSalt();
    user.passwordHash = await bcrypt.hash(password, user.passwordSalt);

    return this.userRepository.save(user);
  }
}
