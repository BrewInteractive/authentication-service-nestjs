import { Mock } from "mockingbird";
import { User } from "../../../src/entities/user.entity";
import { UserResetPasswordRequest } from "../../../src/entities";

export class UserResetPasswordRequestFixture extends UserResetPasswordRequest {
  @Mock((faker) => faker.datatype.number())
  id: number;

  @Mock()
  user: User;

  @Mock()
  expiresAt: Date;

  @Mock()
  resendableAt: Date;

  @Mock((faker) => faker.datatype.string(16))
  key: string;

  @Mock()
  createdAt: Date;

  @Mock()
  updatedAt: Date;
}
