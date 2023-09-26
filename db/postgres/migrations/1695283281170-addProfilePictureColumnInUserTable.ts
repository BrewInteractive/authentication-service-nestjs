import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfilePictureColumnInUserTable1695283281170
  implements MigrationInterface
{
  name = "AddProfilePictureColumnInUserTable1695283281170";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "profile_picture" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "profile_picture"`
    );
  }
}
