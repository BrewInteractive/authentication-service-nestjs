import { MigrationInterface, QueryRunner } from "typeorm";

export class FixForRefreshTokenTable1700581441938 implements MigrationInterface {
    name = 'FixForRefreshTokenTable1700581441938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "PK_648e3f5447f725579d7d4ffdfb7"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "PK_648e3f5447f725579d7d4ffdfb7" PRIMARY KEY ("name")`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "UQ_448c9f457477232449e037412d0"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD "role" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "REL_3ddc983c5f7bcf132fd8732c3f"`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "UQ_448c9f457477232449e037412d0" UNIQUE ("user_id", "role")`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "UQ_eb89618ba1924ecf88e1887959f" UNIQUE ("user_id", "refresh_token")`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "UQ_448c9f457477232449e037412d0"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "REL_3ddc983c5f7bcf132fd8732c3f" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD "role" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "UQ_448c9f457477232449e037412d0" UNIQUE ("user_id", "role")`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "PK_648e3f5447f725579d7d4ffdfb7"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "PK_648e3f5447f725579d7d4ffdfb7" PRIMARY KEY ("name")`);
    }

}
