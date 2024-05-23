import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUsersAddPhoneNumberAndCountryCode1716459645805 implements MigrationInterface {
    name = 'AlterTableUsersAddPhoneNumberAndCountryCode1716459645805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "country_code" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_3af2173ef46868bbebe55ab4d4d" UNIQUE ("country_code")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone_number" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_3af2173ef46868bbebe55ab4d4d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "country_code"`);
    }

}
