import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "otps" })
export class Otp {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "expires_at" })
  expiresAt: Date;

  @Column({ name: "resendable_at", nullable: true })
  resendableAt: Date;

  @Column({ name: "value" })
  value: string;

  @Column({ name: "channel", type: "jsonb" })
  channel: {
    email?: string;
  };
}
