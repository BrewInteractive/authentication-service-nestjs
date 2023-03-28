import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "../models/user.entity";
import { SignUpDto } from "../auth/dto/sign-up.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "../auth/dto/login.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(username: string, email: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ username }, { email }],
    });
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.getUser(loginDto.username, loginDto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }

  async createUser(signUpDto: SignUpDto): Promise<User> {
    const { username, email, password } = signUpDto;
    const existingUser = await this.getUser(username, email);

    if (existingUser) {
      throw new ConflictException("Username or email already exists");
    }
    const passwordSalt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, passwordSalt);
    const user = new User();
    user.username = username;
    user.email = email;
    user.passwordHash = passwordHash;
    user.passwordSalt = passwordSalt;
    user.firstName = signUpDto.firstName;
    user.lastName = signUpDto.lastName;
    return this.userRepository.save(user);
  }
}
