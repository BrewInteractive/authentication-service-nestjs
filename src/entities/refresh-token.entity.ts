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

import { User } from "./user.entity";

@Entity({ name: "refresh_tokens" })
@Unique(["user", "refreshToken"])
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "refresh_token" })
  refreshToken?: string;

  @Column({ name: "expires_at" })
  expiresAt?: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
