import { Role } from "./role.entity";
import { User } from "./user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users_roles" })
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type: User) => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToOne((type: Role) => Role, (role) => role.name)
  @JoinColumn({ name: "role" })
  role: Role;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
