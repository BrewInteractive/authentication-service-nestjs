import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForeignKeyForUserAndResetPasswordRequest1701868644355 implements MigrationInterface {
    name = 'AddForeignKeyForUserAndResetPasswordRequest1701868644355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" ADD CONSTRAINT "FK_09ed6f56ad60370f59d233bd161" FOREIGN KEY ("email") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" DROP CONSTRAINT "FK_09ed6f56ad60370f59d233bd161"`);
    }

}
