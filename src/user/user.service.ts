import { ConflictException, Injectable } from "@nestjs/common";
import { User } from "../models/user.entity";
import { SignUpDto } from "../auth/dto/sign-up.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

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
