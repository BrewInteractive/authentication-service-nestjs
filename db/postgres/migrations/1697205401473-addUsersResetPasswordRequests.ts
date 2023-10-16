import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersResetPasswordRequests1697205401473 implements MigrationInterface {
    name = 'AddUsersResetPasswordRequests1697205401473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_reset_password_requests" ("id" SERIAL NOT NULL, "expires_at" TIMESTAMP, "resendable_at" TIMESTAMP, "key" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, CONSTRAINT "PK_d8c1e3c6ea26e360344a1a30065" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" ADD CONSTRAINT "FK_20476d8847b3954a71f7a7eead1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_reset_password_requests" DROP CONSTRAINT "FK_20476d8847b3954a71f7a7eead1"`);
        await queryRunner.query(`DROP TABLE "users_reset_password_requests"`);
    }

}
