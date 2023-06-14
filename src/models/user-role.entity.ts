import { Role } from "./role.entity";
import { User } from "./user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";

@Entity({ name: "users_roles" })
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type: User) => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne((type: Role) => Role, (role) => role.name, { nullable: false })
  @JoinColumn({ name: "role" })
  role: Role;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
