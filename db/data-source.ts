import { DataSource, DataSourceOptions } from "typeorm";
require("dotenv").config();

const DB_DRIVE = process.env.DB_DRIVE || "postgres";

export const dataSourceOptions: DataSourceOptions = {
  type: DB_DRIVE as "mysql" | "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [`${__dirname}/../**/*.entity.{js,ts}`],
  migrations: [`${__dirname}/${DB_DRIVE}/migrations/*.ts`],
  migrationsTableName:
    process.env.DB_MIGRATION_TABLE_NAME || "auth_service_migration",
  synchronize: true,
  ssl: process.env.DB_SSL_CA
    ? {
        ca: process.env.DB_SSL_CA,
      }
    : JSON.parse(process.env.DB_SSL || "false"),
};

export default new DataSource(dataSourceOptions);
