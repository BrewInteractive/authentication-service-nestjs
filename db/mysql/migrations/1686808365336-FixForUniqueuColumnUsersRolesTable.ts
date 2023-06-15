import { MigrationInterface, QueryRunner } from "typeorm";

export class FixForUniqueuColumnUsersRolesTable1686808365336 implements MigrationInterface {
    name = 'FixForUniqueuColumnUsersRolesTable1686808365336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_roles\` DROP FOREIGN KEY \`FK_07f7b2d43de43962cd118145d70\``);
        await queryRunner.query(`ALTER TABLE \`users_roles\` DROP FOREIGN KEY \`FK_e4435209df12bc1f001e5360174\``);
        await queryRunner.query(`DROP INDEX \`IDX_e4435209df12bc1f001e536017\` ON \`users_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_07f7b2d43de43962cd118145d7\` ON \`users_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_448c9f457477232449e037412d\` ON \`users_roles\``);
        await queryRunner.query(`DROP INDEX \`REL_e4435209df12bc1f001e536017\` ON \`users_roles\``);
        await queryRunner.query(`DROP INDEX \`REL_07f7b2d43de43962cd118145d7\` ON \`users_roles\``);
        await queryRunner.query(`ALTER TABLE \`users_roles\` ADD UNIQUE INDEX \`IDX_e4435209df12bc1f001e536017\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`users_roles\` ADD UNIQUE INDEX \`IDX_07f7b2d43de43962cd118145d7\` (\`role\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_e4435209df12bc1f001e536017\` ON \`users_roles\` (\`user_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_07f7b2d43de43962cd118145d7\` ON \`users_roles\` (\`role\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_448c9f457477232449e037412d\` ON \`users_roles\` (\`user_id\`, \`role\`)`);
        await queryRunner.query(`ALTER TABLE \`users_roles\` ADD CONSTRAINT \`FK_e4435209df12bc1f001e5360174\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_roles\` ADD CONSTRAINT \`FK_07f7b2d43de43962cd118145d70\` FOREIGN KEY (\`role\`) REFERENCES \`roles\`(\`name\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_roles\` DROP FOREIGN KEY \`FK_07f7b2d43de43962cd118145d70\``);
        await queryRunner.query(`ALTER TABLE \`users_roles\` DROP FOREIGN KEY \`FK_e4435209df12bc1f001e5360174\``);
        await queryRunner.query(`DROP INDEX \`IDX_448c9f457477232449e037412d\` ON \`users_roles\``);
        await queryRunner.query(`DROP INDEX \`REL_07f7b2d43de43962cd118145d7\` ON \`users_roles\``);
        await queryRunner.query(`DROP INDEX \`REL_e4435209df12bc1f001e536017\` ON \`users_roles\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users_roles\` DROP INDEX \`IDX_07f7b2d43de43962cd118145d7\``);
        await queryRunner.query(`ALTER TABLE \`users_roles\` DROP INDEX \`IDX_e4435209df12bc1f001e536017\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_07f7b2d43de43962cd118145d7\` ON \`users_roles\` (\`role\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_e4435209df12bc1f001e536017\` ON \`users_roles\` (\`user_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_448c9f457477232449e037412d\` ON \`users_roles\` (\`user_id\`, \`role\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_07f7b2d43de43962cd118145d7\` ON \`users_roles\` (\`role\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e4435209df12bc1f001e536017\` ON \`users_roles\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`users_roles\` ADD CONSTRAINT \`FK_e4435209df12bc1f001e5360174\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_roles\` ADD CONSTRAINT \`FK_07f7b2d43de43962cd118145d70\` FOREIGN KEY (\`role\`) REFERENCES \`roles\`(\`name\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
