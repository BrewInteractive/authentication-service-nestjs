import { Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "roles" })
export class Role {
  @PrimaryColumn()
  name: string;
}
