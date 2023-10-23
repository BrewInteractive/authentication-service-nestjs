import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "users_reset_password_requests" })
export class UserResetPasswordRequest {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: "expires_at", nullable: true })
  expiresAt: Date;

  @Column({ name: "resendable_at", nullable: true })
  resendableAt: Date;

  @Column({ name: "key", nullable: false })
  key: string;

  @ManyToOne((type) => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
