import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertDefaultRoles1715601410181 implements MigrationInterface {
    name = 'InsertDefaultRoles1715601410181'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "roles" ("name") VALUES ('user'),('administrator') ON CONFLICT DO NOTHING;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
