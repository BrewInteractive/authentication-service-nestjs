import { AutoMap } from "@automapper/classes/src/lib/automap";
import { SnowflakeId } from "../utils/snowflake-id";
import * as crypto from "crypto";
import { UserRole } from "./user-role.entity";
import {
  BeforeInsert,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserResetPasswordRequest } from "./user-reset-password-request.entity";

@Entity({ name: "users" })
@Check(`"email" IS NOT NULL OR "username" IS NOT NULL`)
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
  @Column({ name: "first_name" })
  firstName: string;

  @AutoMap()
  @Column({ name: "last_name" })
  lastName: string;

  @Column({ name: "password_hash" })
  passwordHash: string;

  @Column({ name: "password_salt" })
  passwordSalt: string;

  @Column({ name: "email_verified", default: false })
  emailVerified: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roles: Array<UserRole>;

  @Column({ name: "profile_picture", nullable: true })
  profilePicture: string;

  @OneToMany(() => UserResetPasswordRequest, userResetPasswordRequest => userResetPasswordRequest.user)
  userResetPasswordRequests: UserResetPasswordRequest[];
}
