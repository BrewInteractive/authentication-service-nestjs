import { User } from "./user.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

@Entity({ name: "reflash_tokens" })
export class ReflashToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "recovery_key" })
  recoveryKey?: string;

  @Column({ name: "recovery_key_expiry" })
  recoveryKeyExpiry?: Date;

  @OneToOne((type: User) => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
