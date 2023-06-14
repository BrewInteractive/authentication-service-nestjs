import { MigrationInterface, QueryRunner } from "typeorm";

export class FixForRelationshipUsersRolesTable1686743815940 implements MigrationInterface {
    name = 'FixForRelationshipUsersRolesTable1686743815940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_07f7b2d43de43962cd118145d70"`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_07f7b2d43de43962cd118145d70" FOREIGN KEY ("role") REFERENCES "roles"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_07f7b2d43de43962cd118145d70"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "UQ_07f7b2d43de43962cd118145d70"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "UQ_e4435209df12bc1f001e5360174"`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_07f7b2d43de43962cd118145d70" FOREIGN KEY ("role") REFERENCES "roles"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
