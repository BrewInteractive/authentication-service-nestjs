import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

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

  @Column({ name: "email", nullable: false })
  email: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
