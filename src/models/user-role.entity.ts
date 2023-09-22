import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import { Role } from "./role.entity";
import { User } from "./user.entity";

@Entity({ name: "users_roles" })
@Unique(["user", "role"])
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type: User) => User, (user) => user.id, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne((type: Role) => Role, (role) => role.name, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "role" })
  @Column("text")
  role: Role;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
