import { Mock, MockFactory } from "mockingbird";
import { RefreshToken } from "../../../src/entities/refresh-token.entity";
import { User } from "../../../src/entities/user.entity";
import { UserFixture } from "../user/user.fixture";

export class RefreshTokenFixture extends RefreshToken {
    @Mock((faker) => faker.random.alpha())
    id: string;

    @Mock((faker) => faker.random.alphaNumeric(32))
    refreshToken?: string | undefined;

    @Mock((faker) => faker.date.future())
    expiresAt: Date;

    user: User;

    @Mock((faker) => faker.date.future())
    createdAt: Date;

    @Mock((faker) => faker.date.future())
    updatedAt: Date;

    withUser() {
        this.user = MockFactory(UserFixture).one();
        return this;
    }
}