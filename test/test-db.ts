import { DataType, newDb } from "pg-mem";
import { TypeOrmOptionsFactory } from "@nestjs/typeorm";

export function createTestDbAsync() {
  const db = newDb();
  db.public.registerFunction({
    name: "current_database",
    args: [],
    returns: DataType.text,
    implementation: (x) => `hello world ${x}`,
  });

  return db.adapters.createTypeormDataSource({
    type: "postgres",
    entities: ["../src/**/*.entity.ts"],
    synchronize: true,
  }) as TypeOrmOptionsFactory;
}
