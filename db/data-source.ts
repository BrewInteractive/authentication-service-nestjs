import { DataSource, DataSourceOptions } from "typeorm";
require("dotenv").config();

const DB_DRIVE = process.env.DB_DRIVE || "postgres";

export const dataSourceOptions: DataSourceOptions = {
  type: DB_DRIVE as "mysql" | "postgres",
  host: "localhost",
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["src/**/*.entity.ts"],
  migrations: [`db/${DB_DRIVE}/migrations/*.ts`],
  migrationsTableName:
    process.env.DB_MIGRATION_TABLE_NAME || "auth_service_migration",
};

export default new DataSource(dataSourceOptions);
