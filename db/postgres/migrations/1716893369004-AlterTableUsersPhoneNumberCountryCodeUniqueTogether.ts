import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUsersPhoneNumberCountryCodeUniqueTogether1716893369004 implements MigrationInterface {
    name = 'AlterTableUsersPhoneNumberCountryCodeUniqueTogether1716893369004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_3af2173ef46868bbebe55ab4d4d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a04a5bd217fb4a1f1d013cd064f" UNIQUE ("phone_number", "country_code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a04a5bd217fb4a1f1d013cd064f"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_3af2173ef46868bbebe55ab4d4d" UNIQUE ("country_code")`);
    }

}
