import { MigrationInterface, QueryRunner } from "typeorm";

export class FixForUniqueuColumnUsersRolesTable1686808361071 implements MigrationInterface {
    name = 'FixForUniqueuColumnUsersRolesTable1686808361071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_07f7b2d43de43962cd118145d70"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "UQ_448c9f457477232449e037412d0"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "UQ_e4435209df12bc1f001e5360174"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "UQ_07f7b2d43de43962cd118145d70"`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "UQ_448c9f457477232449e037412d0" UNIQUE ("user_id", "role")`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_07f7b2d43de43962cd118145d70" FOREIGN KEY ("role") REFERENCES "roles"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_07f7b2d43de43962cd118145d70"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "UQ_448c9f457477232449e037412d0"`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "UQ_07f7b2d43de43962cd118145d70" UNIQUE ("role")`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "UQ_e4435209df12bc1f001e5360174" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "UQ_448c9f457477232449e037412d0" UNIQUE ("user_id", "role")`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_07f7b2d43de43962cd118145d70" FOREIGN KEY ("role") REFERENCES "roles"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
