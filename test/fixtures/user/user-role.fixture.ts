import { Mock } from "mockingbird";
import { UserRole } from "../../../src/models/user-role.entity";
import { UserFixture } from "./user.fixture";
import { RoleFixture } from "./role.fixture";
import { User } from "../../../src/models/user.entity";
import { Role } from "../../../src/models/role.entity";

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
