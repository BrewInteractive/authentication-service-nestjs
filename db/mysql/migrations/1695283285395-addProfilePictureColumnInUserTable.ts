import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfilePictureColumnInUserTable1695283285395
  implements MigrationInterface
{
  name = "AddProfilePictureColumnInUserTable1695283285395";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`profile_picture\` varchar(255) NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`profile_picture\``
    );
  }
}
