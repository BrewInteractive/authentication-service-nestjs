import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "roles" })
export class Role {
  @PrimaryColumn()
  name: string;
}
