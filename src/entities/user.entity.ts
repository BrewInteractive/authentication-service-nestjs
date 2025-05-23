import * as crypto from "crypto";

import {
  BeforeInsert,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import { AutoMap } from "@automapper/classes";
import { RefreshToken } from "./refresh-token.entity";
import { SnowflakeId } from "../utils/snowflake-id";
import { UserResetPasswordRequest } from "./user-reset-password-request.entity";
import { UserRole } from "./user-role.entity";

@Entity({ name: "users" })
@Check(
  `"email" IS NOT NULL OR "username" IS NOT NULL OR ("phone_number" IS NOT NULL AND "country_code" IS NOT NULL)`
)
@Unique(["phoneNumber", "countryCode"])
export class User {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  createSnowflakeId() {
    this.id = SnowflakeId.generate(
      BigInt(crypto.randomBytes(4).readUInt32BE())
    ).toString();
  }

  @AutoMap()
  @Column({ unique: true, nullable: true })
  username?: string;

  @AutoMap()
  @Column({ unique: true, nullable: true })
  email?: string;

  @AutoMap()
  @Column({ name: "country_code", nullable: true })
  countryCode?: string;

  @AutoMap()
  @Column({ name: "phone_number", nullable: true })
  phoneNumber?: string;

  @Column({ name: "phone_verified", default: false })
  phoneVerified: boolean;

  @AutoMap()
  @Column({ name: "first_name" })
  firstName: string;

  @AutoMap()
  @Column({ name: "last_name" })
  lastName: string;

  @Column({ name: "password_hash", nullable: true })
  passwordHash?: string;

  @Column({ name: "password_salt", nullable: true })
  passwordSalt?: string;

  @Column({ name: "email_verified", default: false })
  emailVerified: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user, { cascade: true })
  roles: Array<UserRole>;

  @Column({ name: "profile_picture", nullable: true })
  profilePicture: string;

  @OneToMany(
    () => UserResetPasswordRequest,
    (userResetPasswordRequest) => userResetPasswordRequest.user,
    {
      cascade: true,
    }
  )
  userResetPasswordRequests: UserResetPasswordRequest[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];
}
