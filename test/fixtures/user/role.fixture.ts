import { Mock } from "mockingbird";
import { Role } from "../../../src/models/role.entity";

export class RoleFixture extends Role {
  @Mock()
  name: string;
}
