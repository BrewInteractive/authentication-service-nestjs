import {
  Entity,
  Column,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  AfterInsert,
} from "typeorm";

@Entity({ name: "users" })
@Check(`"email" IS NOT NULL OR "username" IS NOT NULL`)
export class User {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @AfterInsert()
  addId() {
    this.id = Number(
      ((BigInt(Date.now()) - BigInt(1577836800000)) << BigInt(23)) |
        (BigInt(1) << BigInt(10)) |
        BigInt(this.id)
    );
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

  @Column({ name: "email_verified" })
  emailVerified: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
