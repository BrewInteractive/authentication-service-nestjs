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
  id: number;

  @Column({ name: "expires_at", nullable: true })
  expiresAt: Date;

  @Column({ name: "resendable_at", nullable: true })
  resendableAt: Date;

  @Column({ name: "key", nullable: false })
  key: string;

  @ManyToOne((type) => User, (user) => user.email, { nullable: false })
  @JoinColumn({ name: "email" })
  user: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
