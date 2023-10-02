import { Mock } from "mockingbird";
import { Role } from "../../../src/entities/role.entity";
import { RoleFixture } from "./role.fixture";
import { User } from "../../../src/entities/user.entity";
import { UserFixture } from "./user.fixture";
import { UserRole } from "../../../src/entities/user-role.entity";

export class UserRoleFixture extends UserRole {
  @Mock()
  id: number;

  @Mock(UserFixture)
  user: User;

  @Mock(RoleFixture)
  role: Role;

  @Mock()
  createdAt: Date;

  @Mock()
  updatedAt: Date;
}
