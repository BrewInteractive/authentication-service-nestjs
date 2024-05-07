import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOtpTable1714636954008 implements MigrationInterface {
  name = "CreateOtpsTable1714636954008";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP NOT NULL, "resendable_at" TIMESTAMP, "value" character varying NOT NULL, "channel" jsonb NOT NULL, CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "otps"`);
  }
}
