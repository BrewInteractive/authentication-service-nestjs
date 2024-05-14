import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterResetPasswordRequestExpiresAtNullableFalse1715595241211 implements MigrationInterface {
    name = 'AlterResetPasswordRequestExpiresAtNullableFalse1715595241211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "users_reset_password_requests" SET "expires_at" = NOW() WHERE "expires_at" IS NULL;`);
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" ALTER COLUMN "expires_at" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" ALTER COLUMN "expires_at" DROP NOT NULL`);
    }

}
