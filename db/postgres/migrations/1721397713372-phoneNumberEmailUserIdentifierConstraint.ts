import { MigrationInterface, QueryRunner } from "typeorm";

export class PhoneNumberEmailUserIdentifierConstraint1721397713372 implements MigrationInterface {
    name = 'PhoneNumberEmailUserIdentifierConstraint1721397713372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_077ae242c03e2563b787657b7d" CHECK ("email" IS NOT NULL OR "username" IS NOT NULL OR ("phone_number" IS NOT NULL AND "country_code" IS NOT NULL))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "CHK_077ae242c03e2563b787657b7d"`);
    }

}
