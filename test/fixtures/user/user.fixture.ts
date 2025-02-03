import * as bcrypt from "bcrypt";

import { Mock, MockFactory } from "mockingbird";
import {
  RefreshToken,
  UserResetPasswordRequest,
  UserRole,
} from "../../../src/entities";

import { User } from "../../../src/entities/user.entity";
import { UserRoleFixture } from "./user-role.fixture";

export class UserFixture extends User {
  @Mock((faker) => faker.random.alpha())
  id: string;

  @Mock((faker) => faker.internet.userName())
  username: string;

  @Mock((faker) => faker.internet.email())
  email: string;

  @Mock((faker) => faker.name.firstName())
  firstName: string;

  @Mock((faker) => faker.name.lastName())
  lastName: string;

  @Mock()
  passwordHash: string;
  @Mock()
  passwordSalt: string;

  @Mock((faker) => faker.internet.password())
  password: string;

  @Mock((faker) => faker.datatype.boolean())
  emailVerified: boolean;

  @Mock((faker) => faker.date.future())
  createdAt: Date;

  @Mock((faker) => faker.date.future())
  updatedAt: Date;

  @Mock((faker) => faker.phone.phoneNumber())
  phoneNumber?: string;

  @Mock((faker) => faker.address.countryCode())
  countryCode?: string;

  roles: Array<UserRole>;

  userResetPasswordRequests: UserResetPasswordRequest[];

  refreshTokens: RefreshToken[];

  withRoles(size: number = 2) {
    this.roles = MockFactory(UserRoleFixture).many(size);
    return this;
  }

  hashPassword() {
    this.passwordSalt = bcrypt.genSaltSync();
    this.passwordHash = bcrypt.hashSync(this.password, this.passwordSalt);
    return this;
  }
}
