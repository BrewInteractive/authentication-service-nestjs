import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpireOldResetRequestsTrigger1697205401475 implements MigrationInterface {
  name = 'AddExpireOldResetRequestsTrigger1697205401475';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

    await queryRunner.query(`
      CREATE TRIGGER expire_old_reset_requests_trigger
      BEFORE INSERT ON users_reset_password_requests
      FOR EACH ROW
      EXECUTE FUNCTION expire_old_reset_requests();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TRIGGER IF EXISTS expire_old_reset_requests_trigger ON users_reset_password_requests');
    await queryRunner.query('DROP FUNCTION IF EXISTS expire_old_reset_requests');
  }
}
