import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUserIdentifierConstraint1721397378179
  implements MigrationInterface
{
  name = "DropUserIdentifierConstraint1721397378179";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "CHK_12a0db5d228c223335db95f7f7"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "CHK_12a0db5d228c223335db95f7f7" CHECK (((email IS NOT NULL) OR (username IS NOT NULL)))`
    );
  }
}
