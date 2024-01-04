import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterResetPasswordRequestEmailNullableFalse1704375610929 implements MigrationInterface {
    name = 'AlterResetPasswordRequestEmailNullableFalse1704375610929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" DROP CONSTRAINT "FK_09ed6f56ad60370f59d233bd161"`);
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" ADD CONSTRAINT "FK_09ed6f56ad60370f59d233bd161" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" DROP CONSTRAINT "FK_09ed6f56ad60370f59d233bd161"`);
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" ADD CONSTRAINT "FK_09ed6f56ad60370f59d233bd161" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
