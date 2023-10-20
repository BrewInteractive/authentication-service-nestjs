import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFunctionGenerateTokenKey1699205401473 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION generate_reset_password_key() RETURNS TRIGGER AS $$
            BEGIN
              IF NEW.key IS NULL THEN
              NEW.key = md5(random()::text)::character varying;
              END IF;
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            CREATE TRIGGER users_reset_password_generate_token
            BEFORE INSERT ON users_reset_password_requests
            FOR EACH ROW
            EXECUTE FUNCTION generate_reset_password_key();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS users_reset_password_generate_token ON users_reset_password_requests;
        `);

        await queryRunner.query(`
            DROP FUNCTION IF EXISTS generate_reset_password_key;
        `);
    }
}
