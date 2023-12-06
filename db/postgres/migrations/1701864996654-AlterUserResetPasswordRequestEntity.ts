import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserResetPasswordRequestEntity1701864996654 implements MigrationInterface {
    name = 'AlterUserResetPasswordRequestEntity1701864996654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" DROP CONSTRAINT "FK_20476d8847b3954a71f7a7eead1"`);
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" RENAME COLUMN "user_id" TO "email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" RENAME COLUMN "email" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" ADD CONSTRAINT "FK_20476d8847b3954a71f7a7eead1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
