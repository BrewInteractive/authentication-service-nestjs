import { Mock } from "mockingbird";
import { Role } from "../../../src/entities/role.entity";

export class RoleFixture extends Role {
  @Mock()
  name: string;
}
