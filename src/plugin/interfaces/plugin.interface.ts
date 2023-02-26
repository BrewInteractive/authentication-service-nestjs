import { ModuleRef } from "@nestjs/core";

export interface IPlugin {
  name: string;
  displayName: string;
  load(moduleRef: ModuleRef): Promise<void>;
}
