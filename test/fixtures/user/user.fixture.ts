import { Mock, MockFactory } from "mockingbird";
import { User } from "../../../src/models/user.entity";
import { UserRole } from "../../../src/models/user-role.entity";
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

  @Mock((faker) => faker.random.alphaNumeric(32))
  passwordHash: string;

  @Mock((faker) => faker.random.alphaNumeric(32))
  passwordSalt: string;

  @Mock((faker) => faker.internet.password())
  password: string;

  @Mock((faker) => faker.datatype.boolean())
  emailVerified: boolean;

  @Mock((faker) => faker.date.future())
  createdAt: Date;

  @Mock((faker) => faker.date.future())
  updatedAt: Date;

  roles: Array<UserRole>;

  withRoles(size: number = 2) {
    this.roles = MockFactory(UserRoleFixture).many(size);
    return this;
  }
}
