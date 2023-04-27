import * as path from "path";

import { DataType, newDb } from "pg-mem";

import { DataSource } from "typeorm";
import { v4 } from "uuid";

export async function setupTestDataSourceAsync() {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    implementation: () => "test",
    name: "current_database",
  });

  db.public.registerFunction({
    implementation: () => "test",
    name: "version",
  });

  db.registerExtension("uuid-ossp", (schema) => {
    schema.registerFunction({
      name: "uuid_generate_v4",
      returns: DataType.uuid,
      implementation: v4,
      impure: true,
    });
  });

  const ds: DataSource = await db.adapters.createTypeormConnection({
    type: "postgres",
    entities: [path.join(__dirname, "/../src/models/*.entity{.ts,.js}")],
  });

  await ds.synchronize();

  return ds;
}
