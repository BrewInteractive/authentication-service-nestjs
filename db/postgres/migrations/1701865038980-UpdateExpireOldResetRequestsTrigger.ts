import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExpireOldResetRequestsTrigger1701865038980 implements MigrationInterface {
    name = 'UpdateExpireOldResetRequestsTrigger1701865038980'

   
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION expire_old_reset_requests() RETURNS TRIGGER AS $$
      BEGIN
          UPDATE users_reset_password_requests
          SET expires_at = NOW()
          WHERE email = NEW.email
          AND expires_at IS NULL;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION expire_old_reset_requests() RETURNS TRIGGER AS $$
      BEGIN
          UPDATE users_reset_password_requests
          SET expires_at = NOW()
          WHERE user_id = NEW.user_id
          AND expires_at IS NULL;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
  }
}
