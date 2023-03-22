import {
  AfterInsert,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { SnowflakeId } from "../utils/snowflake-id";

@Entity({ name: "users" })
@Check(`"email" IS NOT NULL OR "username" IS NOT NULL`)
export class User {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @AfterInsert()
  createSnowflakeId() {
    this.id = SnowflakeId.generate(this.id);
  }

  @Column({ unique: true, nullable: true })
  username?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ name: "first_name" })
  firstName: string;

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
}
